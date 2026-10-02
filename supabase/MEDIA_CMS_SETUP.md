# Media CMS Setup

The CMS uses the existing static Next.js export, Supabase Auth, Postgres RLS, Storage, and one Supabase Edge Function. No service-role key is used by the browser.

## 1. Apply the database migration

Link the Supabase CLI to the project connected to this site, then apply migrations:

```powershell
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates `cms_users`, `media_posts`, `media_galleries`, the public `media-assets` bucket, RLS policies, and the auth-backed role check. Galleries store up to 10 image references per set in the existing storage bucket.

## 2. Bootstrap the super admin

Create or confirm an Auth user for `admin@livestockcarnival.ng` in Supabase Dashboard → Authentication → Users. Set its password privately in the dashboard; do not put it in source control or send it through chat.

The migration promotes that Auth user automatically if the account already exists when the migration runs. If the Auth user is created afterwards, run this query in the Supabase SQL Editor:

```sql
insert into public.cms_users (user_id, email, display_name, role)
select id, lower(email), 'Super Admin', 'super_admin'
from auth.users
where lower(email) = 'admin@livestockcarnival.ng'
on conflict (user_id) do update
set email = excluded.email,
    role = 'super_admin';
```

Only this profile can use the Team Access screen. The email address by itself does not grant access.

## 3. Configure invitation redirects and deploy the Edge Function

In Supabase Dashboard → Authentication → URL Configuration, allow the production and local invite callback URLs:

- `https://livestockcarnival.ng/admin/accept-invite`
- `http://localhost:3000/admin/accept-invite`

Deploy the user-management function. Supabase supplies its URL, anon key, and service-role key to the Edge runtime. Set the canonical invite destination if it differs from the default:

```powershell
npx supabase functions deploy cms-user-management
npx supabase secrets set SITE_URL=https://livestockcarnival.ng
```

Configure Supabase Auth email delivery/SMTP so editorial invitations can be delivered. The Edge Function verifies the caller's session and `super_admin` role before using its service-role client to invite or remove accounts.

## 4. Editorial workflow

Open `/admin/login`. The super admin signs in and invites editorial staff from **Team access**. Invited staff set their password from the email link, then can create, edit, publish, unpublish, or delete media posts and upload/remove a cover image. Editors cannot manage accounts. Published stories appear on `/media`; drafts are visible only inside the CMS.

## 5. Configure Web Push and private accreditation files

The migration `20261008000000_push_notifications_and_private_credentials.sql` adds the `push_notifications` editor permission, private accreditation storage, subscriber/campaign tables, rate limiting, and scheduled database jobs. Apply it with `npx supabase db push` before deploying the new site build. Credential objects are stored as paths in `accreditations.file_path`; public clients can upload PDFs into `accreditations/` but cannot read them. Review documents through Supabase Dashboard → Storage using an authorized administrator account. After migration, the public bucket URLs that may have existed for older files no longer grant access.

Create a VAPID key pair locally; keep the private key secret:

```powershell
npx --yes web-push generate-vapid-keys
```

Set the Edge Function secrets (paste the generated values into your terminal prompt; do not commit them):

```powershell
npx supabase secrets set SITE_URL=https://livestockcarnival.ng VAPID_PUBLIC_KEY=<public-key> VAPID_PRIVATE_KEY=<private-key> PUSH_CRON_SECRET=<long-random-secret>
```

Store the same cron secret and the function URL in Supabase Vault. Replace `<project-ref>` and `<long-random-secret>`; run this only in the Supabase SQL Editor over a trusted administrator session:

```sql
select vault.create_secret('https://<project-ref>.supabase.co/functions/v1/push-notifications', 'push_function_url');
select vault.create_secret('<long-random-secret>', 'push_cron_secret');
```

Deploy the function after the migration and secrets are configured:

```powershell
npx supabase functions deploy push-notifications
```

The migration schedules broadcast dispatch every minute and accreditation cleanup daily. Cleanup starts after the carnival ends and removes reviewed (non-pending) accreditation rows and their private files; pending reviews are retained for staff action. Campaign copy and delivery totals are retained for up to 90 days, and hashed anti-abuse rate-limit records for up to 3 hours. Set the super-admin/editor `Push notifications` permission in Team access to control who can create, send, schedule, and cancel broadcasts. Subscribers can opt out from the website or their browser settings. On iPhone/iPad, users must add the site to the Home Screen and launch it from that icon before subscribing.

The public `/privacy` and `/terms` pages describe this website and its push notifications. The separate pass and vendor portals have their own terms and privacy responsibilities.
