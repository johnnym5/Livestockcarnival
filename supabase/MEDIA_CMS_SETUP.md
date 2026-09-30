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
