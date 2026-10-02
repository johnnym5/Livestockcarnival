'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Eye,
  File,
  FileImage,
  FilePlus2,
  FileText,
  Folder,
  HardDrive,
  Images,
  ImagePlus,
  LogOut,
  MailPlus,
  MessageSquare,
  Newspaper,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import { CmsProfile, CmsStaff, formatFileSize, makeSlug, MediaGallery, MediaPost, MediaPostStatus, StorageFileItem } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import HomepageAnimationTuner from '@/components/admin/HomepageAnimationTuner';
import { CMS_PERMISSION_OPTIONS, type CmsPermissionKey } from '@/lib/cmsPermissions';

type AdminView = 'stories' | 'galleries' | 'storage' | 'team' | 'homepage' | 'site-content' | 'animation';
type StorageBucketName = 'livestock-images' | 'media-assets' | 'credentials';

const BUCKET_OPTIONS: { id: StorageBucketName; label: string; maxMb: number }[] = [
  { id: 'livestock-images', label: 'livestock-images (Public, 50MB, Any)', maxMb: 50 },
  { id: 'media-assets', label: 'media-assets (Public, 12MB, Images)', maxMb: 12 },
  { id: 'credentials', label: 'credentials (Public, 50MB, Any)', maxMb: 50 },
];

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

interface HomepageCardDraft {
  id: string; position: number; number: string; eyebrow: string; title: string; body: string; image: string;
  link: string; cta: string; pageTitle: string; coverBg: string; accentColor: string; enabled: boolean; status: 'draft' | 'published';
}

const blankHomepageCard = (position: number): HomepageCardDraft => ({
  id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, position, number: String(position).padStart(2, '0'), eyebrow: '', title: '', body: '', image: '',
  link: '/', cta: 'EXPLORE THIS PAGE', pageTitle: '', coverBg: 'from-[#062412] via-[#0D4020] to-[#031209]', accentColor: '#E4B03A', enabled: true, status: 'draft',
});

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

type EditablePage = 'magazine' | 'schedule' | 'livestock' | 'fashion';
const defaultStaffPermissions: CmsPermissionKey[] = ['stories'];

export default function AdminDashboardPage({ workspace = 'admin' }: { workspace?: 'admin' | 'editor' }) {
  const router = useRouter();
  const [profile, setProfile] = useState<CmsProfile | null>(null);
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [galleries, setGalleries] = useState<MediaGallery[]>([]);
  const [staff, setStaff] = useState<CmsStaff[]>([]);
  const [permissions, setPermissions] = useState<CmsPermissionKey[]>([]);
  const [invitePermissions, setInvitePermissions] = useState<CmsPermissionKey[]>(defaultStaffPermissions);
  const [permissionDrafts, setPermissionDrafts] = useState<Record<string, CmsPermissionKey[]>>({});
  const [homepageCards, setHomepageCards] = useState<HomepageCardDraft[]>([]);
  const [homepageDraft, setHomepageDraft] = useState<HomepageCardDraft | null>(null);
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [adminLightboxImage, setAdminLightboxImage] = useState<{ galleryName: string; url: string; alt: string; index: number; total: number } | null>(null);
  const [isGalleryEditorOpen, setIsGalleryEditorOpen] = useState(false);
  const [galleryName, setGalleryName] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryStatus, setGalleryStatus] = useState<MediaPostStatus>('draft');
  const [isGallerySaving, setIsGallerySaving] = useState(false);

  const [selectedBucket, setSelectedBucket] = useState<StorageBucketName>('media-assets');
  const [storageFiles, setStorageFiles] = useState<StorageFileItem[]>([]);
  const [isStorageLoading, setIsStorageLoading] = useState(false);
  const [isUploadingStorage, setIsUploadingStorage] = useState(false);
  const [storageSearch, setStorageSearch] = useState('');
  const [storageTypeFilter, setStorageTypeFilter] = useState<'all' | 'image' | 'video' | 'doc'>('all');
  const [previewMedia, setPreviewMedia] = useState<{ url: string; name: string; isVideo: boolean } | null>(null);

  const [galleryBackendImages, setGalleryBackendImages] = useState<{ url: string; path: string; alt: string }[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'gallery' | 'story' | 'homepage' | 'site-content'>('gallery');
  const siteImageSetterRef = useRef<((url: string) => void) | null>(null);
  const [mediaPickerBucket, setMediaPickerBucket] = useState<StorageBucketName>('media-assets');
  const [mediaPickerFiles, setMediaPickerFiles] = useState<StorageFileItem[]>([]);
  const [mediaPickerSearch, setMediaPickerSearch] = useState('');
  const [mediaPickerSelected, setMediaPickerSelected] = useState<{ url: string; path: string; alt: string }[]>([]);
  const [mediaPickerUrlInput, setMediaPickerUrlInput] = useState('');
  const [isMediaPickerLoading, setIsMediaPickerLoading] = useState(false);

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
      if ((workspace === 'admin' && cmsProfile.role !== 'super_admin') || (workspace === 'editor' && cmsProfile.role === 'super_admin')) {
        router.replace(cmsProfile.role === 'super_admin' ? '/admin' : '/editor');
        return;
      }
      setProfile(cmsProfile);

      let allowed: CmsPermissionKey[] = [];
      if (cmsProfile.role === 'super_admin') allowed = CMS_PERMISSION_OPTIONS.map(({ key }) => key);
      else {
        const { data: grants, error: grantsError } = await supabase.from('cms_user_permissions').select('permission_key').eq('user_id', cmsProfile.user_id);
        if (!active) return;
        if (grantsError) { setError('Your editor access could not be verified. Please sign in again.'); await supabase.auth.signOut(); router.replace('/admin/login'); return; }
        allowed = (grants ?? []).map((row) => row.permission_key as CmsPermissionKey);
        if (!allowed.length) { setError('No workspace areas have been assigned to this account. Contact your super admin.'); setIsLoading(false); return; }
        setPermissions(allowed);
        const viewPermissions: Record<string, CmsPermissionKey> = { stories: 'stories', galleries: 'galleries', storage: 'media_storage', homepage: 'homepage_cards', animation: 'animation_settings' };
        const firstView = ['stories', 'galleries', 'storage', 'homepage', 'site-content', 'animation'].find((view) => view === 'site-content' ? allowed.some((key) => key.startsWith('page_')) : allowed.includes(viewPermissions[view]));
        if (firstView) setActiveView(firstView as AdminView);
      }

      if (allowed.includes('stories')) {
      const { data: postData, error: postError } = await supabase
        .from('media_posts')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!active) return;
      if (postError) setError('The newsroom posts could not be loaded. Check that the CMS migration has been applied.');
      else setPosts((postData ?? []) as MediaPost[]);
      }

      if (allowed.includes('galleries')) {
      const { data: galleryData, error: galleryError } = await supabase
        .from('media_galleries')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!active) return;
      if (galleryError) setError('Image galleries could not be loaded. Apply the media galleries migration to enable this section.');
      else setGalleries((galleryData ?? []) as MediaGallery[]);
      }

      if (allowed.includes('homepage_cards')) {
      const { data: homepageData, error: homepageError } = await supabase.from('homepage_cards').select('*').order('position');
      if (!active) return;
      if (homepageError) setError('Homepage cards could not be loaded. Apply the homepage cards migration.');
      else setHomepageCards((homepageData ?? []).map((row) => ({
        id: row.id, position: row.position, number: row.number, eyebrow: row.eyebrow, title: row.title, body: row.body,
        image: row.image, link: row.link, cta: row.cta, pageTitle: row.page_title, coverBg: row.cover_bg,
        accentColor: row.accent_color, enabled: row.enabled, status: row.status,
      })));
      }

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
  }, [router, workspace]);

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

  const reloadGalleries = async () => {
    const { data, error: reloadError } = await supabase
      .from('media_galleries')
      .select('*')
      .order('updated_at', { ascending: false });
    if (reloadError) throw reloadError;
    setGalleries((data ?? []) as MediaGallery[]);
  };

  const saveHomepageCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!homepageDraft || isSaving) return;
    if (homepageDraft.enabled && homepageCards.filter((card) => card.enabled && card.id !== homepageDraft.id).length >= 10) {
      setError('A maximum of 10 homepage cards can be enabled.'); return;
    }
    setIsSaving(true); setError('');
    const { error: saveError } = await supabase.from('homepage_cards').upsert({
      id: homepageDraft.id, position: homepageDraft.position, number: homepageDraft.number, eyebrow: homepageDraft.eyebrow,
      title: homepageDraft.title, body: homepageDraft.body, image: homepageDraft.image, link: homepageDraft.link,
      cta: homepageDraft.cta, page_title: homepageDraft.pageTitle, cover_bg: homepageDraft.coverBg,
      accent_color: homepageDraft.accentColor, enabled: homepageDraft.enabled, status: homepageDraft.status,
    });
    if (saveError) setError(`Could not save homepage card: ${saveError.message}`);
    else {
      const { data } = await supabase.from('homepage_cards').select('*').order('position');
      setHomepageCards((data ?? []).map((row) => ({ id: row.id, position: row.position, number: row.number, eyebrow: row.eyebrow, title: row.title, body: row.body, image: row.image, link: row.link, cta: row.cta, pageTitle: row.page_title, coverBg: row.cover_bg, accentColor: row.accent_color, enabled: row.enabled, status: row.status })));
      setHomepageDraft(null); setNotice('Homepage card saved.');
    }
    setIsSaving(false);
  };

  const moveHomepageCard = async (card: HomepageCardDraft, direction: -1 | 1) => {
    const ordered = [...homepageCards].sort((a, b) => a.position - b.position);
    const index = ordered.findIndex((item) => item.id === card.id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return;
    [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
    const updates = ordered.map((item, position) => ({ ...item, position: position + 1 }));
    const { error: updateError } = await supabase.from('homepage_cards').upsert(updates.map((item) => ({
      id: item.id, position: item.position, number: item.number, eyebrow: item.eyebrow, title: item.title, body: item.body,
      image: item.image, link: item.link, cta: item.cta, page_title: item.pageTitle, cover_bg: item.coverBg,
      accent_color: item.accentColor, enabled: item.enabled, status: item.status,
    })));
    if (updateError) setError(`Could not reorder cards: ${updateError.message}`);
    else setHomepageCards(updates);
  };

  const deleteHomepageCard = async (card: HomepageCardDraft) => {
    if (homepageCards.length <= 3) { setError('At least 3 homepage cards are required.'); return; }
    const { error: deleteError } = await supabase.from('homepage_cards').delete().eq('id', card.id);
    if (deleteError) { setError(`Could not remove card: ${deleteError.message}`); return; }
    const reordered = homepageCards.filter((item) => item.id !== card.id).map((item, index) => ({ ...item, position: index + 1 }));
    await supabase.from('homepage_cards').upsert(reordered.map((item) => ({ id: item.id, position: item.position, number: item.number, eyebrow: item.eyebrow, title: item.title, body: item.body, image: item.image, link: item.link, cta: item.cta, page_title: item.pageTitle, cover_bg: item.coverBg, accent_color: item.accentColor, enabled: item.enabled, status: item.status })));
    setHomepageCards(reordered);
  };

  const openNewGallery = () => {
    setGalleryName('');
    setGalleryDescription('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setGalleryBackendImages([]);
    setGalleryStatus('draft');
    setError('');
    setIsGalleryEditorOpen(true);
  };

  const handleGalleryFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type))) {
      setError('Use JPG, PNG, WebP, or AVIF images.');
      event.target.value = '';
      return;
    }
    if (files.some((file) => file.size > 12 * 1024 * 1024)) {
      setError('Each image must be smaller than 12 MB.');
      event.target.value = '';
      return;
    }
    if (files.length + galleryBackendImages.length > 10) {
      setError(`A gallery can contain up to 10 images total. You currently have ${galleryBackendImages.length} library images selected.`);
      event.target.value = '';
      return;
    }
    setError('');
    setGalleryFiles(files);
    setGalleryPreviews((previews) => { previews.forEach((preview) => URL.revokeObjectURL(preview)); return files.map((file) => URL.createObjectURL(file)); });
  };

  const handleSaveGallery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const totalImages = galleryFiles.length + galleryBackendImages.length;
    if (!profile || !galleryName.trim() || !totalImages || isGallerySaving) return;
    setIsGallerySaving(true);
    setError('');
    const uploaded: { url: string; path: string; alt: string }[] = [];
    for (const file of galleryFiles) {
      const safeFilename = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const path = `${profile.user_id}/galleries/${crypto.randomUUID()}-${safeFilename}`;
      const { error: uploadError } = await supabase.storage.from('media-assets').upload(path, file, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        if (uploaded.length) await supabase.storage.from('media-assets').remove(uploaded.map((image) => image.path));
        setError('One or more local images could not be uploaded. Check the media-assets bucket and try again.');
        setIsGallerySaving(false);
        return;
      }
      uploaded.push({ url: supabase.storage.from('media-assets').getPublicUrl(path).data.publicUrl, path, alt: file.name.replace(/\.[^.]+$/, '') });
    }

    const allImages = [...galleryBackendImages, ...uploaded];

    const { error: insertError } = await supabase.from('media_galleries').insert({
      name: galleryName.trim(),
      description: galleryDescription.trim(),
      images: allImages,
      status: galleryStatus,
      author_id: profile.user_id,
      published_at: galleryStatus === 'published' ? new Date().toISOString() : null,
    });
    if (insertError) {
      if (uploaded.length) await supabase.storage.from('media-assets').remove(uploaded.map((image) => image.path));
      setError('The gallery could not be saved. Confirm that the media galleries migration is applied.');
      setIsGallerySaving(false);
      return;
    }
    await reloadGalleries();
    setIsGallerySaving(false);
    setIsGalleryEditorOpen(false);
    setNotice(galleryStatus === 'published' ? 'Gallery published to the media center.' : 'Gallery saved as a draft.');
  };

  const handleGalleryStatus = async (gallery: MediaGallery) => {
    const status: MediaPostStatus = gallery.status === 'published' ? 'draft' : 'published';
    const { error: updateError } = await supabase.from('media_galleries').update({ status, published_at: status === 'published' ? new Date().toISOString() : null }).eq('id', gallery.id);
    if (updateError) { setError('Gallery status could not be updated.'); return; }
    await reloadGalleries();
    setNotice(status === 'published' ? 'Gallery published.' : 'Gallery moved back to drafts.');
  };

  const handleDeleteGalleryImage = async (gallery: MediaGallery, imageIndex: number) => {
    const image = gallery.images[imageIndex];
    if (!image || !window.confirm('Delete this image from the gallery?')) return;
    const nextImages = gallery.images.filter((_, index) => index !== imageIndex);
    if (!nextImages.length) {
      const { error: deleteError } = await supabase.from('media_galleries').delete().eq('id', gallery.id);
      if (deleteError) { setError('The gallery could not be deleted.'); return; }
      await supabase.storage.from('media-assets').remove([image.path]);
      await reloadGalleries();
      setNotice('The last image and its empty gallery were deleted.');
      return;
    }
    const { error: updateError } = await supabase.from('media_galleries').update({ images: nextImages }).eq('id', gallery.id);
    if (updateError) { setError('The image could not be removed from the gallery.'); return; }
    await supabase.storage.from('media-assets').remove([image.path]);
    await reloadGalleries();
    setNotice('Image removed from gallery.');
  };

  const handleDeleteGallery = async (gallery: MediaGallery) => {
    if (!window.confirm(`Delete the “${gallery.name}” gallery and all of its images? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('media_galleries').delete().eq('id', gallery.id);
    if (deleteError) { setError('The gallery could not be deleted.'); return; }
    const paths = gallery.images.map((image) => image.path);
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from('media-assets').remove(paths);
      if (storageError) setError('Gallery deleted, but one or more storage images could not be removed.');
    }
    await reloadGalleries();
    setNotice('Gallery and its images deleted.');
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
    if (!inviteEmail.trim() || !inviteName.trim() || isInviting) return;
    if (!invitePermissions.length) { setError('Choose at least one workspace area before sending an invitation.'); return; }
    setIsInviting(true);
    setError('');
    setNotice('');

    const { data, error: inviteError } = await supabase.functions.invoke('cms-user-management', {
      body: {
        action: 'invite',
        email: inviteEmail.trim().toLowerCase(),
        display_name: inviteName.trim(),
        permissions: invitePermissions,
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
    setInvitePermissions(defaultStaffPermissions);
    const { data: staffResult } = await supabase.functions.invoke('cms-user-management', { body: { action: 'list' } });
    setStaff((staffResult?.users ?? []) as CmsStaff[]);
    setIsInviting(false);
  };

  const saveMemberPermissions = async (member: CmsStaff) => {
    const nextPermissions = permissionDrafts[member.user_id] ?? member.permissions;
    const { data, error: updateError } = await supabase.functions.invoke('cms-user-management', { body: { action: 'update_permissions', user_id: member.user_id, permissions: nextPermissions } });
    if (updateError) { setError(data?.error ?? 'Could not save editor access.'); return; }
    setStaff((current) => current.map((item) => item.user_id === member.user_id ? { ...item, permissions: nextPermissions } : item));
    setPermissionDrafts((current) => { const next = { ...current }; delete next[member.user_id]; return next; });
    setNotice(`Workspace access updated for ${member.email}.`);
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

  const fetchFilesDeep = async (bucketName: StorageBucketName, currentPath = ''): Promise<StorageFileItem[]> => {
    const { data, error } = await supabase.storage.from(bucketName).list(currentPath, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error || !data) return [];

    let files: StorageFileItem[] = [];
    for (const item of data) {
      const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      const isFolder = !item.id && !item.metadata;

      if (isFolder) {
        const subFiles = await fetchFilesDeep(bucketName, fullPath);
        files = files.concat(subFiles);
      } else {
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fullPath).data.publicUrl;
        files.push({
          ...item,
          name: fullPath,
          publicUrl,
        });
      }
    }
    return files;
  };

  const reloadBucketFiles = async (bucketName: StorageBucketName) => {
    setIsStorageLoading(true);
    try {
      const items = await fetchFilesDeep(bucketName);
      const knownPaths = new Set(items.map((i) => i.name));

      // Fetch fresh database records for galleries and posts
      const [{ data: dbGalleries }, { data: dbPosts }] = await Promise.all([
        supabase.from('media_galleries').select('*'),
        supabase.from('media_posts').select('*'),
      ]);

      for (const gallery of (dbGalleries ?? []) as MediaGallery[]) {
        for (const img of gallery.images ?? []) {
          if (img.url && img.path && !knownPaths.has(img.path)) {
            if (bucketName === 'media-assets' || img.url.includes(`/${bucketName}/`)) {
              items.push({
                name: img.path,
                publicUrl: img.url,
                metadata: { size: undefined, mimetype: 'image/jpeg' },
              });
              knownPaths.add(img.path);
            }
          }
        }
      }

      for (const post of (dbPosts ?? []) as MediaPost[]) {
        if (post.cover_image_url && post.cover_image_path && !knownPaths.has(post.cover_image_path)) {
          if (bucketName === 'media-assets' || post.cover_image_url.includes(`/${bucketName}/`)) {
            items.push({
              name: post.cover_image_path,
              publicUrl: post.cover_image_url,
              metadata: { size: undefined, mimetype: 'image/jpeg' },
            });
            knownPaths.add(post.cover_image_path);
          }
        }
      }

      setStorageFiles(items);
    } catch {
      setError(`Failed to list bucket contents for ${bucketName}.`);
    } finally {
      setIsStorageLoading(false);
    }
  };

  useEffect(() => {
    if (activeView !== 'storage') return;
    const timer = window.setTimeout(() => { void reloadBucketFiles(selectedBucket); }, 0);
    return () => window.clearTimeout(timer);
  }, [activeView, selectedBucket]);

  const openMediaPicker = async (target: 'gallery' | 'story' | 'homepage' | 'site-content', onSiteImage?: (url: string) => void) => {
    setMediaPickerTarget(target);
    if (target === 'site-content') siteImageSetterRef.current = onSiteImage ?? null;
    setMediaPickerSelected([]);
    setMediaPickerUrlInput('');
    setIsMediaPickerOpen(true);
    setIsMediaPickerLoading(true);

    try {
      const items = await fetchFilesDeep(mediaPickerBucket);
      setMediaPickerFiles(items);
    } catch {
      setError('Failed to load media library items.');
    } finally {
      setIsMediaPickerLoading(false);
    }
  };

  const reloadMediaPickerBucket = async (bucketName: StorageBucketName) => {
    setMediaPickerBucket(bucketName);
    setIsMediaPickerLoading(true);
    try {
      const items = await fetchFilesDeep(bucketName);
      setMediaPickerFiles(items);
    } catch {
      setError('Failed to load media library items.');
    } finally {
      setIsMediaPickerLoading(false);
    }
  };

  const toggleSelectMediaItem = (item: StorageFileItem) => {
    if (mediaPickerTarget === 'story') {
      setDraft((current) => ({
        ...current,
        coverImageUrl: item.publicUrl,
        coverImagePath: item.name,
      }));
      setImagePreview(item.publicUrl);
      setSelectedImage(null);
      setIsMediaPickerOpen(false);
      return;
    }
    if (mediaPickerTarget === 'homepage') {
      setHomepageDraft((current) => current ? { ...current, image: item.publicUrl } : current);
      setIsMediaPickerOpen(false);
      return;
    }
    if (mediaPickerTarget === 'site-content') {
      siteImageSetterRef.current?.(item.publicUrl);
      setIsMediaPickerOpen(false);
      return;
    }

    const exists = mediaPickerSelected.some((i) => i.url === item.publicUrl);
    if (exists) {
      setMediaPickerSelected((current) => current.filter((i) => i.url !== item.publicUrl));
    } else {
      const currentTotal = galleryFiles.length + galleryBackendImages.length + mediaPickerSelected.length;
      if (currentTotal >= 10) {
        setError('A gallery can contain at most 10 images total.');
        return;
      }
      setMediaPickerSelected((current) => [
        ...current,
        { url: item.publicUrl, path: item.name, alt: item.name.split('/').pop() || 'Gallery image' },
      ]);
    }
  };

  const handleApplyMediaPickerSelection = () => {
    if (mediaPickerTarget === 'gallery') {
      setGalleryBackendImages((current) => [...current, ...mediaPickerSelected]);
    }
    setIsMediaPickerOpen(false);
  };

  const handleApplyExternalUrl = () => {
    const url = mediaPickerUrlInput.trim();
    if (!url) return;
    if (mediaPickerTarget === 'story') {
      setDraft((current) => ({ ...current, coverImageUrl: url, coverImagePath: '' }));
      setImagePreview(url);
      setSelectedImage(null);
      setIsMediaPickerOpen(false);
    } else if (mediaPickerTarget === 'homepage') {
      setHomepageDraft((current) => current ? { ...current, image: url } : current);
      setIsMediaPickerOpen(false);
    } else if (mediaPickerTarget === 'site-content') {
      siteImageSetterRef.current?.(url);
      setIsMediaPickerOpen(false);
    } else {
      const currentTotal = galleryFiles.length + galleryBackendImages.length;
      if (currentTotal >= 10) {
        setError('A gallery can contain at most 10 images total.');
        return;
      }
      setGalleryBackendImages((current) => [...current, { url, path: '', alt: 'External image' }]);
      setIsMediaPickerOpen(false);
    }
  };

  const handleUploadToStorage = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || isUploadingStorage) return;

    const currentBucket = BUCKET_OPTIONS.find((b) => b.id === selectedBucket);
    const maxBytes = (currentBucket?.maxMb ?? 50) * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxBytes) {
        setError(`"${file.name}" exceeds the ${currentBucket?.maxMb} MB limit for ${selectedBucket}.`);
        event.target.value = '';
        return;
      }
    }

    setIsUploadingStorage(true);
    setError('');
    setNotice('');

    let uploadedCount = 0;
    for (const file of files) {
      const safeFilename = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const timePrefix = new Date().toISOString().slice(0, 10);
      const storagePath = `${timePrefix}-${crypto.randomUUID().slice(0, 8)}-${safeFilename}`;

      const { error: uploadError } = await supabase.storage.from(selectedBucket).upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (uploadError) {
        setError(`Failed to upload "${file.name}": ${uploadError.message}`);
      } else {
        uploadedCount++;
      }
    }

    if (uploadedCount > 0) {
      setNotice(`Uploaded ${uploadedCount} file${uploadedCount > 1 ? 's' : ''} to ${selectedBucket}.`);
      await reloadBucketFiles(selectedBucket);
    }
    setIsUploadingStorage(false);
    event.target.value = '';
  };

  const handleDeleteStorageFile = async (filePath: string) => {
    if (!window.confirm(`Delete "${filePath}" from ${selectedBucket}? This cannot be undone.`)) return;
    setError('');
    const { error: deleteError } = await supabase.storage.from(selectedBucket).remove([filePath]);
    if (deleteError) {
      setError(`Failed to delete "${filePath}": ${deleteError.message}`);
      return;
    }
    setNotice(`Deleted "${filePath}" from ${selectedBucket}.`);
    await reloadBucketFiles(selectedBucket);
  };

  const filteredStorageFiles = useMemo(() => {
    const query = storageSearch.trim().toLowerCase();
    return storageFiles.filter((item) => {
      const matchesSearch = !query || item.name.toLowerCase().includes(query);
      const mime = item.metadata?.mimetype || '';
      const ext = item.name.split('.').pop()?.toLowerCase() || '';

      const isImg = mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(ext);
      const isVid = mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext);

      let matchesType = true;
      if (storageTypeFilter === 'image') matchesType = isImg;
      else if (storageTypeFilter === 'video') matchesType = isVid;
      else if (storageTypeFilter === 'doc') matchesType = !isImg && !isVid;

      return matchesSearch && matchesType;
    });
  }, [storageFiles, storageSearch, storageTypeFilter]);

  const handleCopyShareLink = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setNotice('Direct link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      setError('Could not copy link to clipboard.');
    }
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

  const publishedCount = activeView === 'galleries' ? galleries.filter((gallery) => gallery.status === 'published').length : posts.filter((post) => post.status === 'published').length;
  const draftCount = activeView === 'galleries' ? galleries.length - publishedCount : posts.length - publishedCount;
  const allowed = (key: CmsPermissionKey) => profile.role === 'super_admin' || permissions.includes(key);
  const editablePages = (['magazine', 'schedule', 'livestock', 'fashion'] as EditablePage[]).filter((page) => allowed(`page_${page}` as CmsPermissionKey));
  const navItems: { view: AdminView; label: string; permission: CmsPermissionKey; icon: typeof FileText }[] = [
    { view: 'stories', label: 'Stories', permission: 'stories', icon: FileText },
    { view: 'galleries', label: 'Galleries', permission: 'galleries', icon: Images },
    { view: 'storage', label: 'Media Storage', permission: 'media_storage', icon: Folder },
    { view: 'homepage', label: 'Homepage cards', permission: 'homepage_cards', icon: Images },
    { view: 'site-content', label: 'Page content', permission: 'page_magazine', icon: FileText },
    { view: 'animation', label: 'Animation tuner', permission: 'animation_settings', icon: Images },
  ];
  const visibleNavItems = navItems.filter((item) => item.view !== 'site-content' ? allowed(item.permission) : editablePages.length > 0);

  return (
    <main className="min-h-screen bg-[#F3F5F2] text-[#17251D] lg:flex">
      <aside className="flex shrink-0 flex-col bg-[#0B1B11] px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:px-5 lg:py-7">
        <Link href={workspace === 'editor' ? '/editor' : '/admin'} className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#E4B03A]/35 bg-[#E4B03A]/10 text-[#E4B03A]">
            <Newspaper className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight">Carnival Desk</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Media workspace</span>
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2 lg:flex-col" aria-label={workspace === 'editor' ? 'Editor sections' : 'Admin sections'}>
          {visibleNavItems.map(({ view, label, icon: Icon }) => <button key={view} type="button" onClick={() => setActiveView(view)} aria-current={activeView === view ? 'page' : undefined} className={`flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition lg:flex-none ${activeView === view ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}
          {allowed('live_chat') && <Link href={workspace === 'editor' ? '/editor/chat' : '/admin/chat'} className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/55 hover:bg-white/5 hover:text-white transition lg:flex-none"><MessageSquare className="h-4 w-4" /> Live Support Chat</Link>}
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
          <Link href="/media" target="_blank" rel="noopener noreferrer" className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold text-[#E4B03A] hover:text-white transition">
            <ExternalLink className="h-3.5 w-3.5" /> View public media center
          </Link>
          <button type="button" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[#E3E8E2] bg-[#F3F5F2]/90 px-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">{activeView === 'team' ? 'People and permissions' : 'Content management'}</p>
            <h1 className="mt-0.5 text-lg font-extrabold tracking-tight">{activeView === 'stories' ? 'Media newsroom' : activeView === 'galleries' ? 'Image galleries' : activeView === 'storage' ? 'Media Storage Buckets' : activeView === 'homepage' ? 'Homepage cards' : activeView === 'site-content' ? 'Page content' : activeView === 'animation' ? 'Animation tuner' : 'Editorial team'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs font-semibold text-[#5B675F] sm:block">{profile.email}</span>
            <Link
              href="/media"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDE4DC] bg-white px-3.5 text-xs font-bold text-[#1E4D38] shadow-sm transition hover:border-[#1E4D38] hover:bg-[#F4F7F3]"
            >
              <ExternalLink className="h-4 w-4" /> View Media Page
            </Link>
            {activeView === 'stories' && <button type="button" onClick={openNewPost} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-3.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173D2E] sm:px-4"><FilePlus2 className="h-4 w-4" /> New story</button>}
            {activeView === 'galleries' && <button type="button" onClick={openNewGallery} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-3.5 text-xs font-bold text-white shadow-sm sm:px-4"><ImagePlus className="h-4 w-4" /> New gallery</button>}
            {activeView === 'homepage' && <button type="button" disabled={homepageCards.length >= 10} onClick={() => setHomepageDraft(blankHomepageCard(homepageCards.length + 1))} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-3.5 text-xs font-bold text-white shadow-sm disabled:opacity-50"><FilePlus2 className="h-4 w-4" /> New card</button>}
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

          {activeView === 'homepage' ? (
            <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
              <div className="border-b border-[#E9EDE8] p-5"><h2 className="text-base font-extrabold">Homepage card deck</h2><p className="mt-1 text-xs text-[#758078]">Manage 3–10 cards. Published and enabled cards appear in both the deck and magazine features.</p><p className="mt-2 text-xs font-bold text-[#1E4D38]">{homepageCards.filter((card) => card.enabled && card.status === 'published').length} published and enabled</p></div>
              <div className="divide-y divide-[#EEF1ED]">{homepageCards.map((card, index) => <article key={card.id} className="grid gap-3 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center sm:p-5"><div className="relative h-20 overflow-hidden rounded-xl bg-[#E9EEE8]">{card.image && <Image src={card.image} alt="" fill unoptimized sizes="96px" className="object-cover" />}</div><div className="min-w-0"><div className="mb-1 flex items-center gap-2"><span className="text-[10px] font-bold text-[#8D6B1B]">#{card.position}</span><span className="rounded-full bg-[#EEF4EE] px-2 py-0.5 text-[10px] font-bold uppercase">{card.status}</span>{!card.enabled && <span className="text-[10px] text-[#758078]">Disabled</span>}</div><h3 className="truncate text-sm font-extrabold">{card.title || 'Untitled card'}</h3><p className="mt-1 truncate text-xs text-[#68746C]">{card.eyebrow} · {card.link}</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={!index} onClick={() => void moveHomepageCard(card, -1)} className="h-9 rounded-lg border px-3 text-xs font-bold disabled:opacity-40">Up</button><button type="button" disabled={index === homepageCards.length - 1} onClick={() => void moveHomepageCard(card, 1)} className="h-9 rounded-lg border px-3 text-xs font-bold disabled:opacity-40">Down</button><button type="button" onClick={() => setHomepageDraft(card)} className="h-9 rounded-lg border border-[#1E4D38] px-3 text-xs font-bold text-[#1E4D38]">Edit</button><button type="button" onClick={() => void deleteHomepageCard(card)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B]"><Trash2 className="h-4 w-4" /></button></div></article>)}{!homepageCards.length && <p className="p-8 text-center text-xs text-[#758078]">No cards loaded. Apply the homepage cards migration to initialize the default set.</p>}</div>
            </section>
          ) : activeView === 'site-content' ? (
            <SiteContentEditor allowedPages={editablePages} onChooseImage={(setImage) => void openMediaPicker('site-content', setImage)} />
          ) : activeView === 'animation' ? (
            <HomepageAnimationTuner />
          ) : activeView === 'storage' ? (
            <>
              {/* Storage Summary Cards */}
              <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E4E9E3] bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A776E]">Active Bucket</span>
                  <strong className="mt-2 block text-2xl font-black text-[#17251D]">{selectedBucket}</strong>
                  <span className="mt-1 block text-xs text-[#7A857D]">{BUCKET_OPTIONS.find((b) => b.id === selectedBucket)?.maxMb} MB max file size</span>
                </div>
                <div className="rounded-2xl border border-[#D9EADF] bg-[#F1F8F2] p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#26613F]">Total Files</span>
                  <strong className="mt-2 block text-3xl font-black text-[#1E4D38]">{storageFiles.length}</strong>
                  <span className="mt-1 block text-xs text-[#62776A]">In current bucket</span>
                </div>
                <div className="rounded-2xl border border-[#F0E5C9] bg-[#FFFAED] p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D6B1B]">Access Control</span>
                  <strong className="mt-2 block text-2xl font-black text-[#8D6B1B]">Public CDN</strong>
                  <span className="mt-1 block text-xs text-[#82745C]">Direct links enabled</span>
                </div>
              </section>

              {/* Bucket Explorer Bar */}
              <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#E9EDE8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#526057]">Bucket:</label>
                    <select
                      value={selectedBucket}
                      onChange={(e) => setSelectedBucket(e.target.value as StorageBucketName)}
                      className="h-10 rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] px-3 text-xs font-extrabold outline-none focus:border-[#1E4D38]"
                    >
                      {BUCKET_OPTIONS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="relative block">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#869188]" />
                      <input
                        value={storageSearch}
                        onChange={(e) => setStorageSearch(e.target.value)}
                        placeholder="Search files…"
                        className="h-10 w-full rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] pl-9 pr-3 text-xs outline-none focus:border-[#1E4D38] sm:w-48"
                      />
                    </label>
                    <select
                      value={storageTypeFilter}
                      onChange={(e) => setStorageTypeFilter(e.target.value as 'all' | 'image' | 'video' | 'doc')}
                      className="h-10 rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] px-3 text-xs outline-none focus:border-[#1E4D38]"
                    >
                      <option value="all">All File Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="doc">Documents</option>
                    </select>
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#173D2E]">
                      <Upload className="h-4 w-4" /> {isUploadingStorage ? 'Uploading…' : 'Upload file'}
                      <input
                        type="file"
                        multiple
                        onChange={handleUploadToStorage}
                        disabled={isUploadingStorage}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                {/* Storage Files Display */}
                {isStorageLoading ? (
                  <div className="p-12 text-center text-xs font-semibold text-[#68746C]">Loading files from {selectedBucket}…</div>
                ) : filteredStorageFiles.length ? (
                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                    {filteredStorageFiles.map((file) => {
                      const ext = file.name.split('.').pop()?.toLowerCase() || '';
                      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(ext) || file.metadata?.mimetype?.startsWith('image/');
                      const isVid = ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext) || file.metadata?.mimetype?.startsWith('video/');

                      return (
                        <div key={file.name} className="flex flex-col overflow-hidden rounded-xl border border-[#E1E7E0] bg-[#FBFCFA] p-3 shadow-xs">
                          {/* Thumbnail / Media Container */}
                          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#E9EEE8] grid place-items-center">
                            {isImg ? (
                              <Image
                                src={file.publicUrl}
                                alt={file.name}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, 300px"
                                className="cursor-pointer object-cover transition-transform hover:scale-105"
                                onClick={() => setPreviewMedia({ url: file.publicUrl, name: file.name, isVideo: false })}
                              />
                            ) : isVid ? (
                              <div
                                className="group relative h-full w-full cursor-pointer grid place-items-center bg-black/80 text-white"
                                onClick={() => setPreviewMedia({ url: file.publicUrl, name: file.name, isVideo: true })}
                              >
                                <Video className="h-8 w-8 text-[#E4B03A] transition-transform group-hover:scale-110" />
                                <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold">Play Video</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-[#5E6C62]">
                                <FileText className="h-8 w-8 text-[#8B988F]" />
                                <span className="text-[10px] font-bold uppercase">{ext || 'File'}</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="mt-3 flex-1 min-w-0">
                            <p className="truncate text-xs font-extrabold text-[#17251D]" title={file.name}>
                              {file.name}
                            </p>
                            <p className="mt-1 text-[11px] text-[#758078]">
                              {formatFileSize(file.metadata?.size)} {file.metadata?.mimetype ? `· ${file.metadata.mimetype}` : ''}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-[#EDF0EC] pt-2.5">
                            <button
                              type="button"
                              onClick={() => handleCopyShareLink(file.name, file.publicUrl)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E4D38] hover:underline"
                            >
                              {copiedId === file.name ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                              {copiedId === file.name ? 'Copied' : 'Copy URL'}
                            </button>
                            <div className="flex items-center gap-2">
                              <a
                                href={file.publicUrl}
                                download={file.name.split('/').pop()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#DDE4DC] px-2 text-[11px] font-bold text-[#34473A] hover:bg-[#F4F7F3]"
                              >
                                <Download className="h-3.5 w-3.5" /> Download
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteStorageFile(file.name)}
                                aria-label={`Delete ${file.name}`}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B] hover:bg-rose-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <HardDrive className="mx-auto h-8 w-8 text-[#839186]" />
                    <h3 className="mt-3 text-sm font-extrabold text-[#17251D]">No files found in {selectedBucket}</h3>
                    <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#758078]">
                      {selectedBucket === 'livestock-images'
                        ? 'The website uploads story & gallery files to the media-assets bucket by default. Select media-assets in the bucket dropdown above, or click "Upload file" to add content to livestock-images.'
                        : 'Upload an image, video, or document to populate this bucket.'}
                    </p>
                  </div>
                )}
              </section>
            </>
          ) : activeView === 'stories' ? (
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
                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          {post.status === 'published' && (
                            <>
                              <Link
                                href={`/media?story=${encodeURIComponent(post.slug)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#1E4D38] hover:bg-[#F4F7F3]"
                              >
                                <Eye className="h-3.5 w-3.5" /> View
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleCopyShareLink(post.id, `${window.location.origin}/media?story=${encodeURIComponent(post.slug)}`)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#4B5D50] hover:bg-[#F4F7F3]"
                              >
                                {copiedId === post.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                                {copiedId === post.id ? 'Copied' : 'Share'}
                              </button>
                            </>
                          )}
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
          ) : activeView === 'galleries' ? (
            <>
              <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E4E9E3] bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-[#6A776E]">Image sets</span><strong className="mt-3 block text-3xl font-black">{galleries.length}</strong><span className="mt-1 block text-xs text-[#7A857D]">Gallery collections</span></div>
                <div className="rounded-2xl border border-[#D9EADF] bg-[#F1F8F2] p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-[#26613F]">Published</span><strong className="mt-3 block text-3xl font-black text-[#1E4D38]">{publishedCount}</strong><span className="mt-1 block text-xs text-[#62776A]">Visible in media center</span></div>
                <div className="rounded-2xl border border-[#F0E5C9] bg-[#FFFAED] p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-[#8D6B1B]">Drafts</span><strong className="mt-3 block text-3xl font-black text-[#8D6B1B]">{draftCount}</strong><span className="mt-1 block text-xs text-[#82745C]">Only visible to editors</span></div>
              </section>
              <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
                <div className="border-b border-[#E9EDE8] p-4 sm:p-5"><h2 className="text-base font-extrabold">Galleries</h2><p className="mt-1 text-xs text-[#758078]">Upload a set of up to 10 images, then publish it to the public media center.</p></div>
                {galleries.length ? <div className="divide-y divide-[#EEF1ED]">{galleries.map((gallery) => <article key={gallery.id} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
                  <div className="min-w-0"><div className="mb-1.5 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${gallery.status === 'published' ? 'bg-[#E5F3E8] text-[#1E6A3B]' : 'bg-[#FFF4D8] text-[#8D6B1B]'}`}>{gallery.status}</span><span className="text-[10px] text-[#909A92]">{gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'} · Updated {formatDate(gallery.updated_at)}</span></div><h3 className="text-sm font-extrabold">{gallery.name}</h3>{gallery.description && <p className="mt-1 text-xs leading-5 text-[#68746C]">{gallery.description}</p>}<div className="mt-3 flex gap-2 overflow-x-auto">{gallery.images.map((image, imageIndex) => <div key={image.path} className="group relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#E9EEE8]"><Image src={image.url} alt={image.alt} fill unoptimized sizes="80px" className="cursor-pointer object-cover transition-transform group-hover:scale-105" onClick={() => setAdminLightboxImage({ galleryName: gallery.name, url: image.url, alt: image.alt, index: imageIndex + 1, total: gallery.images.length })} /><button type="button" aria-label={`Delete image ${imageIndex + 1} from ${gallery.name}`} onClick={(event) => { event.stopPropagation(); handleDeleteGalleryImage(gallery, imageIndex); }} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-md bg-[#07150D]/80 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {gallery.status === 'published' && (
                      <>
                        <Link
                          href={`/media?gallery=${encodeURIComponent(gallery.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#1E4D38] hover:bg-[#F4F7F3]"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCopyShareLink(gallery.id, `${window.location.origin}/media?gallery=${encodeURIComponent(gallery.id)}`)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE4DC] px-3 text-xs font-bold text-[#4B5D50] hover:bg-[#F4F7F3]"
                        >
                          {copiedId === gallery.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                          {copiedId === gallery.id ? 'Copied' : 'Share'}
                        </button>
                      </>
                    )}
                    <button type="button" onClick={() => handleGalleryStatus(gallery)} className={`h-9 rounded-lg border px-3 text-xs font-bold ${gallery.status === 'published' ? 'border-[#DDE4DC] text-[#34473A]' : 'border-[#1E4D38] bg-[#1E4D38] text-white'}`}>{gallery.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                    <button type="button" onClick={() => handleDeleteGallery(gallery)} aria-label={`Delete ${gallery.name}`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B] hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </article>)}</div> : <div className="px-6 py-16 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF4EE] text-[#52725A]"><Images className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-extrabold">No galleries yet</h3><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#778279]">Create an image set and publish it when it is ready.</p><button type="button" onClick={openNewGallery} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-bold text-white"><ImagePlus className="h-4 w-4" /> New gallery</button></div>}
              </section>
            </>
          ) : (
            <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
              <div className="border-b border-[#E9EDE8] p-5 sm:p-6">
                <h2 className="text-base font-extrabold">Add an editor</h2>
                <p className="mt-1 text-xs leading-5 text-[#758078]">Invited users receive an email to set their own password. They can manage stories and images, but cannot manage accounts.</p>
                <form onSubmit={handleInvite} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Staff member name" autoComplete="name" required className="h-11 rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" />
                  <input type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="editor@organization.ng" autoComplete="email" required className="h-11 rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" />
                  <button disabled={isInviting || !invitePermissions.length} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-bold text-white disabled:opacity-60"><MailPlus className="h-4 w-4" />{isInviting ? 'Sending…' : 'Add staff'}</button>
                  <fieldset className="grid gap-2 rounded-xl border border-[#E1E7E0] bg-[#F8FAF7] p-3 sm:col-span-3 sm:grid-cols-2 lg:grid-cols-3"><legend className="px-1 text-xs font-extrabold text-[#1E4D38]">Workspace areas (choose at least one)</legend>{CMS_PERMISSION_OPTIONS.map((option) => <label key={option.key} className="flex cursor-pointer items-start gap-2 rounded-lg bg-white p-2.5 text-xs"><input type="checkbox" checked={invitePermissions.includes(option.key)} onChange={(event) => setInvitePermissions((current) => event.target.checked ? [...current, option.key] : current.filter((key) => key !== option.key))} className="mt-0.5 accent-[#1E4D38]" /><span><strong className="block">{option.label}</strong><span className="mt-0.5 block text-[10px] leading-4 text-[#758078]">{option.description}</span></span></label>)}</fieldset>
                </form>
              </div>
              <div className="divide-y divide-[#EEF1ED]">
                {staff.map((member) => (
                  <div key={member.user_id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{member.display_name || member.email}</p>
                      <p className="mt-1 truncate text-xs text-[#758078]">{member.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${member.role === 'super_admin' ? 'bg-[#FFF4D8] text-[#8D6B1B]' : 'bg-[#EEF4EE] text-[#45684E]'}`}>{member.role === 'super_admin' ? 'Super admin' : 'Editorial'}</span>
                      {member.role === 'editorial' && <button type="button" onClick={() => handleRemoveStaff(member)} aria-label={`Remove ${member.email}`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#E8D8D8] text-[#9A4B4B] hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                    </div>
                    {member.role === 'editorial' && <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{CMS_PERMISSION_OPTIONS.map((option) => {
                      const current = permissionDrafts[member.user_id] ?? member.permissions;
                      return <label key={option.key} className="flex cursor-pointer items-start gap-2 rounded-lg border border-[#E7EBE6] bg-[#FBFCFA] p-2.5 text-xs"><input type="checkbox" checked={current.includes(option.key)} onChange={(event) => setPermissionDrafts((drafts) => ({ ...drafts, [member.user_id]: event.target.checked ? [...current, option.key] : current.filter((key) => key !== option.key) }))} className="mt-0.5 accent-[#1E4D38]" /><span><strong className="block">{option.label}</strong><span className="mt-0.5 block text-[10px] leading-4 text-[#758078]">{option.description}</span></span></label>;
                    })}</div>}
                    {member.role === 'editorial' && permissionDrafts[member.user_id] && <div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" onClick={() => void saveMemberPermissions(member)} className="h-9 rounded-lg bg-[#1E4D38] px-3 text-xs font-bold text-white">Save access</button>{permissionDrafts[member.user_id].length === 0 && <span className="text-xs text-[#9A4B4B]">Saving will revoke all workspace access.</span>}</div>}
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
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#526057]">Cover image</span>
                    <button
                      type="button"
                      onClick={() => openMediaPicker('story')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4D38] hover:underline"
                    >
                      <Images className="h-3.5 w-3.5" /> Choose from Media Library
                    </button>
                  </div>
                  {imagePreview ? (
                    <div className="relative h-48 overflow-hidden rounded-xl border border-[#DDE4DC] bg-[#EEF2ED]">
                      <Image src={imagePreview} alt="Selected cover preview" fill unoptimized sizes="(max-width: 672px) 100vw, 672px" className="object-cover" />
                      <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(''); setDraft((current) => ({ ...current, coverImageUrl: '', coverImagePath: '' })); }} className="absolute right-3 top-3 inline-flex h-9 items-center gap-2 rounded-lg bg-black/70 px-3 text-xs font-bold text-white backdrop-blur"><X className="h-3.5 w-3.5" />Remove cover</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#B9C8BB] bg-white px-5 py-6 text-center transition hover:border-[#1E4D38] hover:bg-[#F5F8F4]">
                        <ImagePlus className="h-5 w-5 text-[#55765D]" />
                        <span className="mt-2 text-xs font-bold text-[#34493A]">Upload local image</span>
                        <span className="mt-1 text-[10px] text-[#7D887F]">JPG, PNG, or WebP</span>
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="sr-only" />
                      </label>
                      <button
                        type="button"
                        onClick={() => openMediaPicker('story')}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#B9C8BB] bg-[#F8FAF8] px-5 py-6 text-center transition hover:border-[#1E4D38] hover:bg-[#F1F6F2]"
                      >
                        <Images className="h-5 w-5 text-[#1E4D38]" />
                        <span className="mt-2 text-xs font-bold text-[#1E4D38]">Pick from Storage Library</span>
                        <span className="mt-1 text-[10px] text-[#7D887F]">Select backend image or URL</span>
                      </button>
                    </div>
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

      {homepageDraft && (
        <div className="fixed inset-0 z-[120] flex justify-end bg-[#07150D]/65 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setHomepageDraft(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="homepage-card-editor-title" className="flex h-full w-full max-w-2xl flex-col bg-[#FBFCFA] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#E2E8E1] px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">Homepage editor</p><h2 id="homepage-card-editor-title" className="mt-1 text-lg font-extrabold">{homepageCards.some((card) => card.id === homepageDraft.id) ? 'Edit card' : 'New card'}</h2></div><button type="button" onClick={() => setHomepageDraft(null)} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-lg border bg-white"><X className="h-4 w-4" /></button></header>
            <form onSubmit={(event) => void saveHomepageCard(event)} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Card number<input required value={homepageDraft.number} onChange={(event) => setHomepageDraft({ ...homepageDraft, number: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label><label className="text-xs font-bold">Eyebrow<input value={homepageDraft.eyebrow} onChange={(event) => setHomepageDraft({ ...homepageDraft, eyebrow: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label></div>
                <label className="block text-xs font-bold">Title<input required value={homepageDraft.title} onChange={(event) => setHomepageDraft({ ...homepageDraft, title: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label>
                <label className="block text-xs font-bold">Card text<textarea rows={4} value={homepageDraft.body} onChange={(event) => setHomepageDraft({ ...homepageDraft, body: event.target.value })} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm leading-6" /></label>
                <label className="block text-xs font-bold">Page title on card cover<input value={homepageDraft.pageTitle} onChange={(event) => setHomepageDraft({ ...homepageDraft, pageTitle: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label>
                <div className="rounded-xl border bg-white p-3"><div className="flex items-center gap-3">{homepageDraft.image && <div className="relative h-16 w-24 overflow-hidden rounded-lg"><Image src={homepageDraft.image} alt="" fill unoptimized sizes="96px" className="object-cover" /></div>}<div><p className="text-xs font-bold">Card image</p><p className="mt-1 max-w-xs truncate text-[11px] text-[#758078]">{homepageDraft.image || 'No image selected'}</p></div><button type="button" onClick={() => void openMediaPicker('homepage')} className="ml-auto h-9 rounded-lg bg-[#1E4D38] px-3 text-xs font-bold text-white">Choose image</button></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Destination link<input required value={homepageDraft.link} onChange={(event) => setHomepageDraft({ ...homepageDraft, link: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" placeholder="/attractions or https://…" /></label><label className="text-xs font-bold">Explore link text<input required value={homepageDraft.cta} onChange={(event) => setHomepageDraft({ ...homepageDraft, cta: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label></div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Cover background gradient<input value={homepageDraft.coverBg} onChange={(event) => setHomepageDraft({ ...homepageDraft, coverBg: event.target.value })} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" /></label><label className="text-xs font-bold">Accent color<div className="mt-2 flex h-10 items-center gap-3 rounded-xl border bg-white px-2"><input type="color" value={/^#[\da-f]{6}$/i.test(homepageDraft.accentColor) ? homepageDraft.accentColor : '#E4B03A'} onChange={(event) => setHomepageDraft({ ...homepageDraft, accentColor: event.target.value })} className="h-8 w-10 cursor-pointer border-0" /><input value={homepageDraft.accentColor} onChange={(event) => setHomepageDraft({ ...homepageDraft, accentColor: event.target.value })} className="min-w-0 flex-1 text-sm outline-none" /></div></label></div>
                <div className="flex flex-wrap gap-6 rounded-xl border bg-white p-4"><label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={homepageDraft.enabled} onChange={(event) => setHomepageDraft({ ...homepageDraft, enabled: event.target.checked })} /> Enabled</label><label className="flex items-center gap-2 text-xs font-bold">Status<select value={homepageDraft.status} onChange={(event) => setHomepageDraft({ ...homepageDraft, status: event.target.value as 'draft' | 'published' })} className="h-9 rounded-lg border px-2"><option value="draft">Draft</option><option value="published">Published</option></select></label></div>
                {homepageDraft.status === 'published' && homepageDraft.enabled && homepageCards.filter((card) => card.status === 'published' && card.enabled && card.id !== homepageDraft.id).length < 2 && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">At least 3 cards must be enabled and published to display this card publicly.</p>}
              </div>
              <footer className="flex items-center justify-between border-t bg-white px-5 py-4"><button type="button" onClick={() => setHomepageDraft(null)} className="h-10 rounded-xl border px-4 text-xs font-bold">Cancel</button><button type="submit" disabled={isSaving || (homepageDraft.status === 'published' && homepageDraft.enabled && homepageCards.filter((card) => card.status === 'published' && card.enabled && card.id !== homepageDraft.id).length < 2)} className="h-10 rounded-xl bg-[#1E4D38] px-5 text-xs font-extrabold text-white disabled:opacity-50">{isSaving ? 'Saving…' : 'Save card'}</button></footer>
            </form>
          </section>
        </div>
      )}

      {isGalleryEditorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#07150D]/55 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !isGallerySaving) setIsGalleryEditorOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="gallery-editor-title" className="flex h-full w-full max-w-2xl flex-col bg-[#FBFCFA] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#E2E8E1] px-5 py-4 sm:px-7"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">Media library</p><h2 id="gallery-editor-title" className="mt-1 text-lg font-extrabold">New gallery</h2></div><button type="button" disabled={isGallerySaving} onClick={() => setIsGalleryEditorOpen(false)} aria-label="Close gallery editor" className="grid h-9 w-9 place-items-center rounded-lg border border-[#DDE4DC] bg-white text-[#536158] disabled:opacity-50"><X className="h-4 w-4" /></button></header>
            <form onSubmit={handleSaveGallery} className="flex min-h-0 flex-1 flex-col"><div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
              <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Gallery name</span><input required maxLength={120} value={galleryName} onChange={(event) => setGalleryName(event.target.value)} className="h-11 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-sm font-semibold outline-none focus:border-[#1E4D38]" placeholder="e.g. Opening day highlights" /></label>
              <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#526057]">Description <span className="font-normal normal-case text-[#8A948C]">(optional)</span></span><textarea rows={3} maxLength={500} value={galleryDescription} onChange={(event) => setGalleryDescription(event.target.value)} className="w-full resize-y rounded-xl border border-[#DDE4DC] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#1E4D38]" placeholder="A short note about these photos" /></label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#526057]">
                    Images ({galleryFiles.length + galleryBackendImages.length}/10)
                  </span>
                  <button
                    type="button"
                    onClick={() => openMediaPicker('gallery')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4D38] hover:underline"
                  >
                    <Images className="h-3.5 w-3.5" /> Choose from Media Library
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#B9C8BB] bg-white px-4 py-6 text-center transition hover:border-[#1E4D38] hover:bg-[#F5F8F4]">
                    <ImagePlus className="h-5 w-5 text-[#55765D]" />
                    <span className="mt-2 text-xs font-bold text-[#34493A]">Upload local files</span>
                    <span className="mt-1 text-[10px] text-[#7D887F]">JPG, PNG, WebP · up to 12 MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleGalleryFiles} className="sr-only" />
                  </label>
                  <button
                    type="button"
                    onClick={() => openMediaPicker('gallery')}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#B9C8BB] bg-[#F8FAF8] px-4 py-6 text-center transition hover:border-[#1E4D38] hover:bg-[#F1F6F2]"
                  >
                    <Images className="h-5 w-5 text-[#1E4D38]" />
                    <span className="mt-2 text-xs font-bold text-[#1E4D38]">Pick from Backend Library</span>
                    <span className="mt-1 text-[10px] text-[#7D887F]">Select existing media or paste URL</span>
                  </button>
                </div>

                {/* Previews for Selected Local + Backend Images */}
                {(galleryBackendImages.length > 0 || galleryPreviews.length > 0) && (
                  <div className="mt-3 space-y-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68746C]">Selected Gallery Images:</span>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {/* Backend Selected Images */}
                      {galleryBackendImages.map((bImg, index) => (
                        <div key={bImg.url + index} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#1E4D38]/30 bg-[#EEF2ED]">
                          <Image src={bImg.url} alt={bImg.alt} fill unoptimized sizes="200px" className="object-cover" />
                          <span className="absolute bottom-1 left-1 rounded bg-[#07150D]/80 px-1.5 py-0.5 text-[9px] font-bold text-white">Library</span>
                          <button
                            type="button"
                            onClick={() => setGalleryBackendImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                            aria-label={`Remove library image ${index + 1}`}
                            className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-[#07150D]/80 text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Local File Previews */}
                      {galleryPreviews.map((preview, index) => (
                        <div key={preview} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#DDE4DC] bg-[#EEF2ED]">
                          <Image src={preview} alt={galleryFiles[index]?.name ?? ''} fill unoptimized sizes="200px" className="object-cover" />
                          <span className="absolute bottom-1 left-1 rounded bg-[#07150D]/80 px-1.5 py-0.5 text-[9px] font-bold text-white">Local Upload</span>
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(preview);
                              setGalleryFiles((files) => files.filter((_, itemIndex) => itemIndex !== index));
                              setGalleryPreviews((previews) => previews.filter((_, itemIndex) => itemIndex !== index));
                            }}
                            aria-label={`Remove ${galleryFiles[index]?.name}`}
                            className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-[#07150D]/80 text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <fieldset className="space-y-2"><legend className="text-xs font-bold uppercase tracking-wider text-[#526057]">Publishing status</legend><div className="grid grid-cols-2 gap-2">{(['draft', 'published'] as const).map((status) => <button key={status} type="button" aria-pressed={galleryStatus === status} onClick={() => setGalleryStatus(status)} className={`h-10 rounded-xl border text-xs font-bold capitalize transition ${galleryStatus === status ? status === 'published' ? 'border-[#1E4D38] bg-[#1E4D38] text-white' : 'border-[#D7B75B] bg-[#FFF7E2] text-[#72560F]' : 'border-[#DDE4DC] bg-white text-[#68746B]'}`}>{status}</button>)}</div></fieldset>
              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-800">{error}</p>}
            </div><footer className="flex items-center justify-between gap-3 border-t border-[#E2E8E1] bg-white px-5 py-4 sm:px-7"><span className="text-[11px] text-[#7B867E]">{galleryStatus === 'published' ? 'Visible in the public media center' : 'Only visible to editorial staff'}</span><button type="submit" disabled={isGallerySaving || (galleryFiles.length === 0 && galleryBackendImages.length === 0)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white transition hover:bg-[#173D2E] disabled:opacity-60"><Send className="h-3.5 w-3.5" />{isGallerySaving ? 'Uploading…' : galleryStatus === 'published' ? 'Publish gallery' : 'Save gallery'}</button></footer></form>
          </section>
        </div>
      )}
      {adminLightboxImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#07150D]/90 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdminLightboxImage(null); }}>
          <button type="button" onClick={() => setAdminLightboxImage(null)} aria-label="Close image preview" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
          <figure className="w-full max-w-4xl">
            <div className="relative mx-auto h-[70vh] w-full"><Image src={adminLightboxImage.url} alt={adminLightboxImage.alt} fill unoptimized sizes="100vw" className="object-contain" /></div>
            <figcaption className="mt-3 text-center text-sm font-semibold text-white/90">{adminLightboxImage.galleryName} ({adminLightboxImage.index} / {adminLightboxImage.total})</figcaption>
          </figure>
        </div>
      )}
      {previewMedia && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07150D]/90 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setPreviewMedia(null); }}>
          <button type="button" onClick={() => setPreviewMedia(null)} aria-label="Close preview" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
          <div className="w-full max-w-4xl">
            {previewMedia.isVideo ? (
              <video src={previewMedia.url} controls autoPlay className="max-h-[75vh] w-full rounded-2xl bg-black shadow-2xl" />
            ) : (
              <div className="relative mx-auto h-[70vh] w-full"><Image src={previewMedia.url} alt={previewMedia.name} fill unoptimized sizes="100vw" className="object-contain" /></div>
            )}
            <p className="mt-3 text-center text-sm font-semibold text-white/90">{previewMedia.name}</p>
          </div>
        </div>
      )}

      {/* Backend Media Library Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#07150D]/80 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setIsMediaPickerOpen(false); }}>
          <div role="dialog" aria-modal="true" className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-white/20 bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#E2E8E1] px-6 py-4 bg-[#FBFCFA]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">Backend Media Library</p>
                <h2 className="mt-0.5 text-lg font-extrabold text-[#17251D]">
                  {mediaPickerTarget === 'story' ? 'Select Story Cover Image' : mediaPickerTarget === 'homepage' ? 'Select Homepage Card Image' : mediaPickerTarget === 'site-content' ? 'Select Page Image' : 'Select Gallery Images'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsMediaPickerOpen(false)} aria-label="Close media picker" className="grid h-9 w-9 place-items-center rounded-lg border border-[#DDE4DC] bg-white text-[#536158]"><X className="h-4 w-4" /></button>
            </header>

            {/* Controls Bar */}
            <div className="flex flex-col gap-3 border-b border-[#E9EDE8] bg-[#F8FAF8] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase text-[#526057]">Bucket:</label>
                <select
                  value={mediaPickerBucket}
                  onChange={(e) => reloadMediaPickerBucket(e.target.value as StorageBucketName)}
                  className="h-9 rounded-lg border border-[#DDE4DC] bg-white px-3 text-xs font-extrabold outline-none focus:border-[#1E4D38]"
                >
                  {BUCKET_OPTIONS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#869188]" />
                  <input
                    value={mediaPickerSearch}
                    onChange={(e) => setMediaPickerSearch(e.target.value)}
                    placeholder="Search images…"
                    className="h-9 w-full rounded-lg border border-[#DDE4DC] bg-white pl-8 pr-3 text-xs outline-none focus:border-[#1E4D38] sm:w-44"
                  />
                </label>
              </div>
            </div>

            {/* Direct Image URL Option Box */}
            <div className="border-b border-[#E9EDE8] bg-[#FBFCFA] px-6 py-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526057] mb-1.5">Or Paste Direct Image URL:</label>
              <div className="flex gap-2">
                <input
                  value={mediaPickerUrlInput}
                  onChange={(e) => setMediaPickerUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="h-9 flex-1 rounded-lg border border-[#DDE4DC] bg-white px-3 text-xs outline-none focus:border-[#1E4D38]"
                />
                <button
                  type="button"
                  onClick={handleApplyExternalUrl}
                  disabled={!mediaPickerUrlInput.trim()}
                  className="h-9 rounded-lg bg-[#1E4D38] px-4 text-xs font-bold text-white disabled:opacity-50"
                >
                  Use URL
                </button>
              </div>
            </div>

            {/* Grid Display */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FBFCFA]">
              {isMediaPickerLoading ? (
                <div className="p-12 text-center text-xs font-semibold text-[#68746C]">Loading media from {mediaPickerBucket}…</div>
              ) : mediaPickerFiles.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {mediaPickerFiles
                    .filter((file) => !mediaPickerSearch.trim() || file.name.toLowerCase().includes(mediaPickerSearch.toLowerCase()))
                    .map((file) => {
                      const isSelected = mediaPickerSelected.some((i) => i.url === file.publicUrl) || (mediaPickerTarget === 'story' && draft.coverImageUrl === file.publicUrl);
                      return (
                        <div
                          key={file.name}
                          onClick={() => toggleSelectMediaItem(file)}
                          className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                            isSelected ? 'border-[#1E4D38] ring-2 ring-[#1E4D38]/30 bg-[#EAF2EA]' : 'border-[#DDE4DC] bg-[#E9EEE8] hover:border-[#1E4D38]/60'
                          }`}
                        >
                          <Image src={file.publicUrl} alt={file.name} fill unoptimized sizes="200px" className="object-cover transition-transform group-hover:scale-105" />
                          <div className={`absolute inset-0 transition ${isSelected ? 'bg-[#1E4D38]/20' : 'bg-black/0 group-hover:bg-black/10'}`} />
                          <div className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-[#1E4D38] shadow-sm">
                            {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="h-3 w-3 rounded-full border-2 border-[#818D83]" />}
                          </div>
                          <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs" title={file.name}>
                            {file.name.split('/').pop()}
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Images className="mx-auto h-8 w-8 text-[#839186]" />
                  <p className="mt-2 text-xs font-semibold text-[#68746C]">No media files found in {mediaPickerBucket}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between border-t border-[#E2E8E1] bg-white px-6 py-4">
              <span className="text-xs font-semibold text-[#526057]">
                {mediaPickerTarget === 'story'
                  ? 'Click any image above to set as story cover'
                  : `${mediaPickerSelected.length} backend image${mediaPickerSelected.length === 1 ? '' : 's'} selected`}
              </span>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsMediaPickerOpen(false)} className="h-9 rounded-lg border border-[#DDE4DC] px-4 text-xs font-bold text-[#536158]">
                  Cancel
                </button>
                {mediaPickerTarget === 'gallery' && (
                  <button
                    type="button"
                    onClick={handleApplyMediaPickerSelection}
                    disabled={!mediaPickerSelected.length}
                    className="h-9 rounded-lg bg-[#1E4D38] px-4 text-xs font-extrabold text-white disabled:opacity-50"
                  >
                    Add {mediaPickerSelected.length} to Gallery
                  </button>
                )}
              </div>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
