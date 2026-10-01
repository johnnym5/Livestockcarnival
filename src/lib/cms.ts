import { supabase } from '@/lib/supabase/client';

export type CmsRole = 'super_admin' | 'editorial';
export type MediaPostStatus = 'draft' | 'published';

export interface MediaGalleryImage {
  url: string;
  path: string;
  alt: string;
}

export interface MediaGallery {
  id: string;
  name: string;
  description: string;
  images: MediaGalleryImage[];
  status: MediaPostStatus;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsProfile {
  user_id: string;
  email: string;
  display_name: string;
  role: CmsRole;
  created_at: string;
}

export type CmsStaff = CmsProfile & { permissions: string[] };

export interface MediaPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  cover_image_path: string | null;
  status: MediaPostStatus;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StorageFileItem {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
  } | null;
  publicUrl: string;
}

export async function getCmsProfile(userId: string): Promise<CmsProfile | null> {
  const { data, error } = await supabase
    .from('cms_users')
    .select('user_id,email,display_name,role,created_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as CmsProfile | null;
}

export function makeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return 'Unknown size';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
