export const CMS_PERMISSION_OPTIONS = [
  { key: 'stories', label: 'Stories', description: 'Create and publish newsroom stories.' },
  { key: 'galleries', label: 'Galleries', description: 'Manage and publish media galleries.' },
  { key: 'media_storage', label: 'Media storage', description: 'Upload and organize shared media assets.' },
  { key: 'homepage_cards', label: 'Homepage cards', description: 'Edit the cards and magazine feature order.' },
  { key: 'page_magazine', label: 'Magazine page', description: 'Edit the homepage magazine heading and theme.' },
  { key: 'page_schedule', label: 'Schedule page', description: 'Edit schedule days and event records.' },
  { key: 'page_livestock', label: 'Livestock page', description: 'Edit page copy and the livestock catalog.' },
  { key: 'page_fashion', label: 'Fashion page', description: 'Edit page copy and the breed catalog.' },
  { key: 'animation_settings', label: 'Animation settings', description: 'Tune site motion and the homepage card deck.' },
  { key: 'live_chat', label: 'Live support chat', description: 'View and reply to visitor support threads.' },
  { key: 'push_notifications', label: 'Push notifications', description: 'Send and schedule public site announcements.' },
] as const;

export type CmsPermissionKey = (typeof CMS_PERMISSION_OPTIONS)[number]['key'];
export const ALL_CMS_PERMISSIONS = CMS_PERMISSION_OPTIONS.map(({ key }) => key) as CmsPermissionKey[];

export function permissionForAdminView(view: string): CmsPermissionKey | null {
  const mapping: Record<string, CmsPermissionKey> = {
    stories: 'stories', galleries: 'galleries', storage: 'media_storage', homepage: 'homepage_cards',
    'site-content-magazine': 'page_magazine', 'site-content-schedule': 'page_schedule',
    'site-content-livestock': 'page_livestock', 'site-content-fashion': 'page_fashion', animation: 'animation_settings',
  };
  return mapping[view] ?? null;
}
