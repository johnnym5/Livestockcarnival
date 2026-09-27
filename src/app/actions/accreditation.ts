'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

const accreditationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Full legal name must be at least 3 characters' }),
  organization: z
    .string()
    .trim()
    .min(2, { message: 'Press or media organization name is required' }),
  nin: z
    .string()
    .trim()
    .regex(/^\d{11}$/, {
      message: 'National Identity Number (NIN) must be exactly 11 numeric digits',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Valid editorial email address is required' }),
});

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitAccreditationAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      fullName: formData.get('fullName')?.toString() || '',
      organization: formData.get('organization')?.toString() || '',
      nin: formData.get('nin')?.toString() || '',
      email: formData.get('email')?.toString() || '',
    };

    // 1. Validate form fields with Zod
    const validationResult = accreditationSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = validationResult.error.issues;
      issues.forEach((issue) => {
        if (issue.path && issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return {
        success: false,
        error: 'Validation failed. Please review the highlighted fields.',
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    // 2. Validate PDF File on Server
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Official assignment letter or press credential (PDF) is required.',
        fieldErrors: {
          file: 'Official assignment letter or press credential (PDF) is required',
        },
      };
    }

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return {
        success: false,
        error: 'Uploaded credential must be a valid PDF document.',
        fieldErrors: { file: 'Uploaded credential must be a valid PDF document' },
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size exceeds 5MB limit. Please compress your PDF.',
        fieldErrors: { file: 'File size exceeds 5MB limit. Please compress your PDF.' },
      };
    }

    let fileUrl = '';

    // 3. Upload PDF to Supabase Storage
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `accreditations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('credentials')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('credentials')
          .getPublicUrl(filePath);
        fileUrl = publicUrlData.publicUrl;
      } else {
        console.warn('[Storage Notice] Supabase storage upload notice:', uploadError.message);
      }
    } catch (storageErr) {
      console.warn('[Storage Error] Unable to process file buffer:', storageErr);
    }

    // 4. Insert into Supabase Table
    const { error: insertError } = await supabase.from('accreditations').insert([
      {
        full_name: validatedData.fullName,
        organization: validatedData.organization,
        nin: validatedData.nin,
        email: validatedData.email,
        file_url: fileUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.warn('[Database Notice] Database insert note:', insertError.message);
    }

    return { success: true };
  } catch (err) {
    console.error('[Server Action Error] Accreditation submission error:', err);
    return {
      success: false,
      error: 'An unexpected system error occurred. Please try again later.',
    };
  }
}
