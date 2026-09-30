'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileImage,
  FilePlus2,
  FileText,
  ImagePlus,
  LogOut,
  MailPlus,
  MessageSquare,
  Newspaper,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { CmsProfile, CmsStaff, makeSlug, MediaPost, MediaPostStatus } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

type AdminView = 'stories' | 'team';

interface PostDraft {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  status: MediaPostStatus;
  coverImageUrl: string;
  coverImagePath: string;
}

const emptyDraft: PostDraft = {
  title: '',
  slug: '',
  category: 'Newsroom',
  excerpt: '',
  body: '',
  status: 'draft',
  coverImageUrl: '',
  coverImagePath: '',
};

const formatDate = (date: string | null) => {
  if (!date) return 'Not published';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CmsProfile | null>(null);
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [staff, setStaff] = useState<CmsStaff[]>([]);
  const [activeView, setActiveView] = useState<AdminView>('stories');
  const [statusFilter, setStatusFilter] = useState<'all' | MediaPostStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<MediaPost | null>(null);
  const [draft, setDraft] = useState<PostDraft>(emptyDraft);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }

      let cmsProfile: CmsProfile | null = null;
      const { data: profileData, error: profileError } = await supabase
        .from('cms_users')
        .select('user_id,email,display_name,role,created_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }
      cmsProfile = profileData as CmsProfile;
      if (!active) return;
      setProfile(cmsProfile);

      const { data: postData, error: postError } = await supabase
        .from('media_posts')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!active) return;
      if (postError) setError('The newsroom posts could not be loaded. Check that the CMS migration has been applied.');
      else setPosts((postData ?? []) as MediaPost[]);

      if (cmsProfile.role === 'super_admin') {
        const { data: staffResult, error: staffError } = await supabase.functions.invoke('cms-user-management', {
          body: { action: 'list' },
        });
        if (!active) return;
        if (staffError) setError('The editorial team could not be loaded. Confirm the CMS user-management function is deployed.');
        else setStaff((staffResult?.users ?? []) as CmsStaff[]);
      }
      if (active) setIsLoading(false);
    };

    void initialize();
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!imagePreview.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesSearch = !normalizedQuery || `${post.title} ${post.category} ${post.excerpt}`.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesSearch;
    });
  }, [posts, searchQuery, statusFilter]);

  const reloadPosts = async () => {
    const { data, error: reloadError } = await supabase
      .from('media_posts')
      .select('*')
      .order('updated_at', { ascending: false });
    if (reloadError) throw reloadError;
    setPosts((data ?? []) as MediaPost[]);
  };

  const openNewPost = () => {
    setEditingPost(null);
    setDraft(emptyDraft);
    setSelectedImage(null);
    setImagePreview('');
    setError('');
    setIsEditorOpen(true);
  };

  const openEditPost = (post: MediaPost) => {
    setEditingPost(post);
    setDraft({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      body: post.body,
      status: post.status,
      coverImageUrl: post.cover_image_url ?? '',
      coverImagePath: post.cover_image_path ?? '',
    });
    setSelectedImage(null);
    setImagePreview(post.cover_image_url ?? '');
    setError('');
    setIsEditorOpen(true);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      setError('Choose a JPG, PNG, WebP, or AVIF image.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('Images must be smaller than 12 MB.');
      return;
    }
    setError('');
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSavePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || isSaving) return;

    const title = draft.title.trim();
    const slug = makeSlug(draft.slug || title);
    if (!title || !slug) {
      setError('Add a title so we can create a valid story URL.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');

    let coverImageUrl = draft.coverImageUrl || null;
    let coverImagePath = draft.coverImagePath || null;

    if (selectedImage) {
      const safeFilename = selectedImage.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const newPath = `${profile.user_id}/${crypto.randomUUID()}-${safeFilename}`;
      const { error: uploadError } = await supabase.storage
        .from('media-assets')
        .upload(newPath, selectedImage, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setError('The image upload failed. Confirm the media-assets bucket and editorial upload policy are set up.');
        setIsSaving(false);
        return;
      }
      coverImagePath = newPath;
      coverImageUrl = supabase.storage.from('media-assets').getPublicUrl(newPath).data.publicUrl;
    }

    const payload = {
      title,
      slug,
      category: draft.category.trim() || 'Newsroom',
      excerpt: draft.excerpt.trim(),
      body: draft.body.trim(),
      cover_image_url: coverImageUrl,
      cover_image_path: coverImagePath,
      status: draft.status,
      author_id: editingPost?.author_id ?? profile.user_id,
      published_at: draft.status === 'published' ? editingPost?.published_at ?? new Date().toISOString() : null,
    };

    const result = editingPost
      ? await supabase.from('media_posts').update(payload).eq('id', editingPost.id)
      : await supabase.from('media_posts').insert(payload);

    if (result.error) {
      if (selectedImage && coverImagePath) await supabase.storage.from('media-assets').remove([coverImagePath]);
      setError(result.error.code === '23505' ? 'That story URL is already in use. Change the URL slug and try again.' : 'The story could not be saved. Check your connection and access, then retry.');
      setIsSaving(false);
      return;
    }

    if (editingPost?.cover_image_path && editingPost.cover_image_path !== coverImagePath) {
      await supabase.storage.from('media-assets').remove([editingPost.cover_image_path]);
    }

    await reloadPosts();
    setIsSaving(false);
    setIsEditorOpen(false);
    setNotice(draft.status === 'published' ? 'Story published to the media center.' : 'Draft saved.');
  };

  const handleDeletePost = async (post: MediaPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setError('');
    const { error: deleteError } = await supabase.from('media_posts').delete().eq('id', post.id);
    if (deleteError) {
      setError('The story could not be deleted. Check your access and try again.');
      return;
    }
    if (post.cover_image_path) await supabase.storage.from('media-assets').remove([post.cover_image_path]);
    setNotice('Story deleted.');
    await reloadPosts();
  };

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteEmail.trim() || isInviting) return;
    setIsInviting(true);
    setError('');
    setNotice('');

    const { data, error: inviteError } = await supabase.functions.invoke('cms-user-management', {
      body: {
        action: 'invite',
        email: inviteEmail.trim().toLowerCase(),
        display_name: inviteName.trim(),
        redirect_to: `${window.location.origin}/admin/accept-invite`,
      },
    });

    if (inviteError) {
      setError(data?.error ?? 'The invitation could not be sent. Check Edge Function and email settings.');
      setIsInviting(false);
      return;
    }

    setNotice(`Invitation sent to ${inviteEmail.trim()}.`);
    setInviteEmail('');
    setInviteName('');
    const { data: staffResult } = await supabase.functions.invoke('cms-user-management', { body: { action: 'list' } });
    setStaff((staffResult?.users ?? []) as CmsStaff[]);
    setIsInviting(false);
  };

  const handleRemoveStaff = async (member: CmsStaff) => {
    if (!window.confirm(`Remove ${member.email} from the editorial team?`)) return;
    const { data, error: removeError } = await supabase.functions.invoke('cms-user-management', {
      body: { action: 'remove', user_id: member.user_id },
    });
    if (removeError) {
      setError(data?.error ?? 'The editorial account could not be removed.');
      return;
    }
    setStaff((current) => current.filter((user) => user.user_id !== member.user_id));
    setNotice(`${member.email} no longer has editorial access.`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (isLoading || !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F3F5F2] text-[#33413A]">
        <p className="text-sm font-semibold">Loading newsroom workspace…</p>
      </main>
    );
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const draftCount = posts.length - publishedCount;

  return (
    <main className="min-h-screen bg-[#F3F5F2] text-[#17251D] lg:flex">
      <aside className="flex shrink-0 flex-col bg-[#0B1B11] px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:px-5 lg:py-7">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#E4B03A]/35 bg-[#E4B03A]/10 text-[#E4B03A]">
            <Newspaper className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight">Carnival Desk</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Media workspace</span>
          </span>
        </Link>

        <nav className="flex gap-2 lg:flex-col" aria-label="Admin sections">
          <button
            type="button"
            onClick={() => setActiveView('stories')}
            aria-current={activeView === 'stories' ? 'page' : undefined}
            className={`flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition lg:flex-none ${activeView === 'stories' ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText className="h-4 w-4" /> Stories
          </button>
          <Link
            href="/admin/chat"
            className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/55 hover:bg-white/5 hover:text-white transition lg:flex-none"
          >
            <MessageSquare className="h-4 w-4" /> Live Support Chat
          </Link>
          {profile.role === 'super_admin' && (
            <button
              type="button"
              onClick={() => setActiveView('team')}
              aria-current={activeView === 'team' ? 'page' : undefined}
              className={`flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition lg:flex-none ${activeView === 'team' ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}
            >
              <Users className="h-4 w-4" /> Team access
            </button>
          )}
        </nav>

        <div className="mt-6 hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:block">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E4B03A]">
            <ShieldCheck className="h-4 w-4" />
            {profile.role === 'super_admin' ? 'Super admin' : 'Editorial access'}
          </div>
          <p className="mt-2 truncate text-xs text-white/55">{profile.email}</p>
        </div>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:block">
          <Link href="/media" className="mb-3 block px-2 text-xs font-semibold text-white/55 hover:text-white">View public media center</Link>
          <button type="button" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[#E3E8E2] bg-[#F3F5F2]/90 px-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">{activeView === 'stories' ? 'Content management' : 'People and permissions'}</p>
            <h1 className="mt-0.5 text-lg font-extrabold tracking-tight">{activeView === 'stories' ? 'Media newsroom' : 'Editorial team'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs font-semibold text-[#5B675F] sm:block">{profile.email}</span>
            {activeView === 'stories' && <button type="button" onClick={openNewPost} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-3.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173D2E] sm:px-4"><FilePlus2 className="h-4 w-4" /> New story</button>}
            <button type="button" onClick={handleSignOut} aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-xl border border-[#DDE4DC] bg-white text-[#4F5D53] transition hover:border-rose-200 hover:text-rose-700"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
          {(notice || error) && (
            <div role={error ? 'alert' : 'status'} className={`mb-5 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
              <span>{error || notice}</span>
              <button type="button" aria-label="Dismiss message" onClick={() => { setError(''); setNotice(''); }} className="shrink-0 text-current/60 hover:text-current"><X className="h-4 w-4" /></button>
            </div>
          )}

          {activeView === 'stories' ? (
            <>
              <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E4E9E3] bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A776E]">All stories</span>
                  <strong className="mt-3 block text-3xl font-black">{posts.length}</strong>
                  <span className="mt-1 block text-xs text-[#7A857D]">Newsroom items</span>
                </div>
                <div className="rounded-2xl border border-[#D9EADF] bg-[#F1F8F2] p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#26613F]">Published</span>
                  <strong className="mt-3 block text-3xl font-black text-[#1E4D38]">{publishedCount}</strong>
                  <span className="mt-1 block text-xs text-[#62776A]">Visible in media center</span>
                </div>
                <div className="rounded-2xl border border-[#F0E5C9] bg-[#FFFAED] p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D6B1B]">Drafts</span>
                  <strong className="mt-3 block text-3xl font-black text-[#8D6B1B]">{draftCount}</strong>
                  <span className="mt-1 block text-xs text-[#82745C]">Only visible to editors</span>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#E9EDE8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div>
                    <h2 className="text-base font-extrabold">Stories</h2>
                    <p className="mt-1 text-xs text-[#758078]">Create, review, and publish media center articles.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="relative block">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#869188]" />
                      <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search stories" className="h-10 w-full rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] pl-9 pr-3 text-sm outline-none focus:border-[#1E4D38] sm:w-52" />
                    </label>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | MediaPostStatus)} aria-label="Filter stories by status" className="h-10 rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] px-3 text-sm outline-none focus:border-[#1E4D38]">
                      <option value="all">All statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                    </select>
                  </div>
                </div>

                {visiblePosts.length ? (
                  <div className="divide-y divide-[#EEF1ED]">
                    {visiblePosts.map((post) => (
                      <article key={post.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center sm:p-5">
                        <div className="relative h-20 overflow-hidden rounded-xl bg-[#E9EEE8]">
                          {post.cover_image_url ? <Image src={post.cover_image_url} alt="" fill unoptimized sizes="96px" className="object-cover" /> : <div className="grid h-full place-items-center text-[#849087]"><FileImage className="h-6 w-6" /></div>}
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${post.status === 'published' ? 'bg-[#E5F3E8] text-[#1E6A3B]' : 'bg-[#FFF4D8] text-[#8D6B1B]'}`}>{post.status}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#818C84]">{post.category}</span>
                            <span className="text-[10px] text-[#909A92]">Updated {formatDate(post.updated_at)}</span>
                          </div>
                          <h3 className="truncate text-sm font-extrabold">{post.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#68746C]">{post.excerpt || 'No summary yet.'}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:justify-end">
                          {post.status === 'published' && <Link href="/media" className="inline-flex h-9 items-center rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#4B5D50] hover:bg-[#F4F7F3]">View</Link>}
                          <button type="button" onClick={() => openEditPost(post)} className="h-9 rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#34473A] hover:border-[#B6C8B8] hover:bg-[#F4F7F3]">Edit</button>
                          <button type="button" onClick={() => handleDeletePost(post)} aria-label={`Delete ${post.title}`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B] hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-16 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF4EE] text-[#52725A]"><Newspaper className="h-5 w-5" /></div>
                    <h3 className="mt-4 text-sm font-extrabold">{posts.length ? 'No matching stories' : 'Your newsroom is ready'}</h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#778279]">{posts.length ? 'Try a different title or status filter.' : 'Create a draft, add a cover image, and publish it to the public media center.'}</p>
                    {!posts.length && <button type="button" onClick={openNewPost} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-bold text-white"><FilePlus2 className="h-4 w-4" /> Create first story</button>}
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
              <div className="border-b border-[#E9EDE8] p-5 sm:p-6">
                <h2 className="text-base font-extrabold">Invite editorial staff</h2>
                <p className="mt-1 text-xs leading-5 text-[#758078]">Invited users receive an email to set their own password. They can manage stories and images, but cannot manage accounts.</p>
                <form onSubmit={handleInvite} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Name (optional)" autoComplete="name" className="h-11 rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" />
                  <input type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="editor@organization.ng" autoComplete="email" required className="h-11 rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" />
                  <button disabled={isInviting} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-bold text-white disabled:opacity-60"><MailPlus className="h-4 w-4" />{isInviting ? 'Sending…' : 'Send invite'}</button>
                </form>
              </div>
              <div className="divide-y divide-[#EEF1ED]">
                {staff.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between gap-4 p-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{member.display_name || member.email}</p>
                      <p className="mt-1 truncate text-xs text-[#758078]">{member.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${member.role === 'super_admin' ? 'bg-[#FFF4D8] text-[#8D6B1B]' : 'bg-[#EEF4EE] text-[#45684E]'}`}>{member.role === 'super_admin' ? 'Super admin' : 'Editorial'}</span>
                      {member.role === 'editorial' && <button type="button" onClick={() => handleRemoveStaff(member)} aria-label={`Remove ${member.email}`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B] hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </div>
                ))}
                {!staff.length && <p className="p-8 text-center text-xs text-[#778279]">No editorial accounts yet.</p>}
              </div>
            </section>
          )}
        </div>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#07150D]/55 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsEditorOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="story-editor-title" className="flex h-full w-full max-w-2xl flex-col bg-[#FBFCFA] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#E2E8E1] px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">Newsroom editor</p>
                <h2 id="story-editor-title" className="mt-1 text-lg font-extrabold">{editingPost ? 'Edit story' : 'New story'}</h2>
              </div>
              <button type="button" onClick={() => setIsEditorOpen(false)} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-lg border border-[#DDE4DC] bg-white text-[#536158]"><X className="h-4 w-4" /></button>
            </header>

            <form onSubmit={handleSavePost} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
                <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Headline</span><input required value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value, slug: editingPost ? current.slug : makeSlug(event.target.value) }))} className="h-11 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-sm font-semibold outline-none focus:border-[#1E4D38]" placeholder="Write a clear newsroom headline" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">URL slug</span><input required value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: makeSlug(event.target.value) }))} className="h-11 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-sm outline-none focus:border-[#1E4D38]" /></label>
                  <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Category</span><input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className="h-11 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-sm outline-none focus:border-[#1E4D38]" placeholder="Official Communique" /></label>
                </div>
                <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Summary</span><textarea rows={3} value={draft.excerpt} onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))} className="w-full resize-y rounded-xl border border-[#DDE4DC] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#1E4D38]" placeholder="A short preview shown in the media center" /></label>
                <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Article</span><textarea rows={10} value={draft.body} onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))} className="w-full resize-y rounded-xl border border-[#DDE4DC] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#1E4D38]" placeholder="Write the full story…" /></label>

                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#526057]">Cover image</span>
                  {imagePreview ? (
                    <div className="relative h-48 overflow-hidden rounded-xl border border-[#DDE4DC] bg-[#EEF2ED]">
                      <Image src={imagePreview} alt="Selected cover preview" fill unoptimized sizes="(max-width: 672px) 100vw, 672px" className="object-cover" />
                      <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(''); setDraft((current) => ({ ...current, coverImageUrl: '', coverImagePath: '' })); }} className="absolute right-3 top-3 inline-flex h-9 items-center gap-2 rounded-lg bg-black/70 px-3 text-xs font-bold text-white backdrop-blur"><X className="h-3.5 w-3.5" />Remove cover</button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#B9C8BB] bg-white px-5 py-8 text-center transition hover:border-[#1E4D38] hover:bg-[#F5F8F4]">
                      <ImagePlus className="h-6 w-6 text-[#55765D]" />
                      <span className="mt-2 text-xs font-bold text-[#34493A]">Choose a cover image</span>
                      <span className="mt-1 text-[11px] text-[#7D887F]">JPG, PNG, or WebP · up to 12 MB</span>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="sr-only" />
                    </label>
                  )}
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold uppercase tracking-wider text-[#526057]">Publishing status</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['draft', 'published'] as const).map((status) => (
                      <button key={status} type="button" aria-pressed={draft.status === status} onClick={() => setDraft((current) => ({ ...current, status }))} className={`h-10 rounded-xl border text-xs font-bold capitalize transition ${draft.status === status ? status === 'published' ? 'border-[#1E4D38] bg-[#1E4D38] text-white' : 'border-[#D7B75B] bg-[#FFF7E2] text-[#72560F]' : 'border-[#DDE4DC] bg-white text-[#68746B]'}`}>{status}</button>
                    ))}
                  </div>
                </fieldset>
                {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-800">{error}</p>}
              </div>
              <footer className="flex items-center justify-between border-t border-[#E2E8E1] bg-white px-5 py-4 sm:px-7">
                <span className="text-[11px] text-[#7B867E]">{draft.status === 'published' ? 'Visible in the public media center' : 'Only visible to editorial staff'}</span>
                <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white transition hover:bg-[#173D2E] disabled:opacity-60"><Send className="h-3.5 w-3.5" />{isSaving ? 'Saving…' : draft.status === 'published' ? 'Publish story' : 'Save draft'}</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
