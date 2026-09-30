import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isRateLimited, sanitizeText } from '@/lib/security';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqwohpjschaditdkrdra.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_HYjA-ZuSRTwNMTYBdsMfmA_Kvot5Ylg';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json(
        { error: 'A valid signed-in session is required.' },
        { status: 401 }
      );
    }

    // Authenticate user token
    const clientForAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await clientForAuth.auth.getUser(token);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication session.' },
        { status: 401 }
      );
    }

    const user = userData.user;

    // Apply Rate Limiting (10 msgs / 60s)
    if (isRateLimited(user.id, { limit: 10, windowMs: 60000 })) {
      return NextResponse.json(
        { error: 'You are sending messages too quickly. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const rawText = body.text;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json(
        { error: 'Message text cannot be empty.' },
        { status: 400 }
      );
    }

    // System-wide sanitization
    const sanitizedText = sanitizeText(rawText);
    if (!sanitizedText) {
      return NextResponse.json(
        { error: 'Invalid message content.' },
        { status: 400 }
      );
    }

    // Admin client for DB operations
    const adminDb = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const userEmail = user.email || 'user@livestockcarnival.ng';
    const userName = sanitizeText(
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      userEmail.split('@')[0] ||
      'Help Desk User'
    );
    const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    // Check if user has an existing thread
    const { data: existingThread, error: threadFetchError } = await adminDb
      .from('chat_threads')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (threadFetchError) {
      console.error('Error fetching chat thread:', threadFetchError);
    }

    let threadId = existingThread?.id;

    if (!threadId) {
      // Create new chat thread
      const { data: newThread, error: createThreadError } = await adminDb
        .from('chat_threads')
        .insert({
          user_id: user.id,
          user_email: userEmail,
          user_name: userName,
          user_avatar: userAvatar,
          last_message_text: sanitizedText,
          last_message_timestamp: new Date().toISOString(),
          unread_by_admin: true,
          unread_by_user: false,
        })
        .select('id')
        .single();

      if (createThreadError || !newThread) {
        console.error('Error creating chat thread:', createThreadError);
        return NextResponse.json(
          { error: 'Unable to initialize chat thread. Please try again.' },
          { status: 500 }
        );
      }

      threadId = newThread.id;
    }

    // Insert message into chat_messages
    const { data: insertedMessage, error: insertMsgError } = await adminDb
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        sender_type: 'user',
        text: sanitizedText,
      })
      .select('*')
      .single();

    if (insertMsgError || !insertedMessage) {
      console.error('Error inserting message:', insertMsgError);
      return NextResponse.json(
        { error: 'Failed to deliver message. Please try again.' },
        { status: 500 }
      );
    }

    // Update thread metadata
    await adminDb
      .from('chat_threads')
      .update({
        last_message_text: sanitizedText,
        last_message_timestamp: new Date().toISOString(),
        unread_by_admin: true,
        unread_by_user: false,
        user_name: userName,
        user_avatar: userAvatar || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', threadId);

    return NextResponse.json(
      { success: true, message: insertedMessage, threadId },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('Chat API Error:', errorMsg);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
