# Livestock Carnival Project Context

This document is a practical orientation guide for developers and AI coding assistants opening this repository in a new session. It describes the project as it exists in the source tree, points to the files that own important behavior, and records operational caveats that are easy to miss when reading only the homepage.

**Context date:** 2 October 2026  
**Primary app directory:** repository root (`src/`, `public/`, `supabase/`, `scripts/`)  
**Production site named by project materials:** `https://livestockcarnival.ng`

> Start here, then inspect the relevant source file and current Git changes before editing. This guide is a map, not a replacement for the code. Some root and nested README/backlog material predates the current implementation.

## 1. Project Purpose

The site is the official digital portal for the Renewed Hope National Livestock Carnival 2026, also branded as the Golden Camel & Cow Carnival. The event is described as a public festival and trade showcase at Old Parade Ground, Area 10, Garki, Abuja, scheduled for 21–23 November 2026.

The portal serves several audiences:

- Visitors looking for event highlights, attractions, schedules, venue directions, and free gate passes.
- Livestock exhibitors, vendors, pastoralist groups, agribusinesses, and prospective partners.
- Press and media organizations applying for accreditation and browsing official stories and galleries.
- Editorial staff who maintain site content, media, schedules, cards, and animation settings.
- Site administrators who manage editorial accounts, permissions, and visitor support conversations.

The product combines public event information with operational tools. It is not just a static campaign page: some content is seeded locally as a fallback and can be overridden from Supabase; newsroom content and staff tools depend more directly on Supabase.

## 2. Technology and Runtime

- **Framework:** Next.js 16 App Router, React 19, TypeScript.
- **Styling:** Tailwind CSS 3, PostCSS, and global CSS in `src/app/globals.css`.
- **Motion:** Framer Motion is used throughout; Lenis provides optional smooth scrolling; GSAP is installed and may be used by older or other motion components. Check imports before assuming a library owns a particular animation.
- **Icons:** `lucide-react`.
- **Backend:** Supabase Auth, Postgres, Row Level Security, Storage, Realtime, and one Edge Function.
- **Maps:** Leaflet and React Leaflet. The Leaflet map is dynamically imported client-side.
- **Image rendering:** `next/image`; Next image optimization is disabled in `next.config.ts`, and local image paths are served from `public/`.
- **TypeScript aliases:** `@/*` resolves to `src/*`.

`next.config.ts` sets `output: "export"`, meaning the configured deployment output is static (`out/`). This has an important compatibility question: the source also contains a POST route handler at `src/app/api/chat/send/route.ts`. Verify the intended production host/runtime for that endpoint before assuming a pure static export can serve live chat. The repo README mentions Hostinger, but the actual deploy pipeline and server-side route support should be checked before deployment changes.

## 3. Repository Structure

### Active application source

```text
src/
  app/                  App Router pages, root layout, API route, global CSS
  components/           Shared site shell, page components, admin tools, motion UI
    admin/              CMS/editorial workspaces and animation tuner
    homepage/            Scroll-driven homepage card experience
    motion/              Reusable 3D card/image and showcase components
  data/                 Local defaults and structured event/catalog data
  lib/                  Supabase clients, CMS helpers, data defaults, motion and security utilities
```

### Other important directories

- `public/assets/`: assets served by the web app under `/assets/...`. If code references `/assets/example.jpg`, the expected file is under `public/assets/example.jpg`.
- `assets/`: source, working, and campaign assets. These are not directly served by the app unless copied into `public/` or consumed by a script.
- `data/`: root-level JSON data from earlier iterations. Do not assume it is authoritative; check imports. Current app code primarily uses `src/data/` and defaults in `src/lib/`.
- `supabase/migrations/`: database schema, access policies, seed defaults, and functions.
- `supabase/functions/cms-user-management/`: Supabase Edge Function for privileged staff invitations and removal.
- `scripts/`: asset upload, livestock seeding, flyer generation, and older utility scripts.
- `output/`: generated flyer exports and archives. Generated content may be untracked; inspect Git status before changing or cleaning it.
- `nextjs-app/`: currently contains guidance/backlog/README files and generated Next build folders, but no active `src` tree or package manifest. Treat its `TASKS.md`, `CLAUDE.md`, and README as historical planning notes unless verified otherwise.
- Root HTML/JS/design documents (for example `golden_camel_website.html`, `livestock_cultural_fashion_parade.html`, `3d_deck_implementation_guide.md`) are prototypes/reference material, not the active Next.js routes.

### File responsibilities

- `src/app/layout.tsx`: document metadata, global CSS, and `SiteFrame` wrapper.
- `src/components/SiteFrame.tsx`: shared shell, fixed site header, footer, client route transitions, optional smooth scrolling, initial-load overlay, global site animation settings, and live-chat widget.
- `src/components/Header.tsx`, `Footer.tsx`: global navigation, external registration CTAs, and shared footer directory.
- `src/app/globals.css`: design tokens and global CSS, including homepage deck layout and responsive rules.
- `src/lib/supabase/client.ts`: browser Supabase client.
- `src/lib/supabase/server.ts`: server-only service-role client helper. Never import this from client components.
- `src/lib/cms.ts`: CMS types and common helpers.
- `src/lib/cmsPermissions.ts`: permission keys and mapping from admin workspace view to required permission.
- `src/lib/siteContent.ts`: default editable page copy/data.
- `src/lib/homepageCards.ts`: homepage card type, ten default cards, and CMS-row conversion.
- `src/lib/homepageMotion.ts`: homepage scroll-animation settings, defaults, ranges, and normalization.
- `src/lib/siteAnimation.ts`: global/page animation settings, defaults, and normalization.
- `src/lib/motion.ts`: shared Framer Motion variants and easing curves.
- `src/lib/security.ts`: text sanitization and an in-memory sliding-window rate limiter.
- `src/lib/ics.ts`: creates downloadable `.ics` calendar entries for the schedule.

## 4. Public Routes and Main User Journeys

| Route | Purpose and primary implementation |
|---|---|
| `/` | Event gateway: brand hero, selectable animated highlight cards, magazine-style feature articles, and final gate-pass/vendor/program CTAs. Page shell: `src/app/page.tsx`; deck: `src/components/homepage/HomepageCardDeck.tsx`. |
| `/about` | Carnival vision and policy/initiative overview, strategic pillars, financing concepts, and national development framing. `src/app/about/page.tsx`. |
| `/nhesics` | National Herd Health, Identification, Security, and traceability concepts, digital herd registry, health/security, investment and value-chain themes. `src/app/nhesics/page.tsx`. |
| `/fashion-parade` | Livestock fashion and cultural heritage feature, breed directory/filtering, imagery, welfare and parade content. Defaults in `src/data/fashionBreeds.ts`; page copy and breed list can be overridden from Supabase. |
| `/attractions` | Festival arenas and signature attractions, with livestock types and venue/schedule links. Uses `src/data/attractions.json` and page-local catalog content. |
| `/schedule` | Three-day program with day and track filters, editorially managed schedule override, and downloadable calendar events. `ScheduleTab.tsx`, `src/data/carnivalProgram.ts`, `src/lib/ics.ts`. |
| `/livestock` | Livestock catalog with categories and detail UI; reads editable page content first, then database catalog, then local defaults. `LivestockGrid.tsx`, `src/data/livestockCatalog.ts`. |
| `/media` | Published newsroom posts and image galleries with story/gallery detail and sharing interactions. `MediaPostsFeed.tsx`, `MediaGalleryFeed.tsx`. |
| `/venue-map` | Interactive Leaflet venue map. `LeafletMap.tsx` is loaded dynamically without SSR. Venue map images and references are in `public/assets/venue-map/`. |
| `/contact` | Contact information, departments, social channels, vendor/pass destinations, and navigation to venue information. |
| `/accreditation` | Press/media accreditation explanation and submission form. `AccreditationForm.tsx` validates identity/contact fields and a PDF assignment letter. |
| `/admin/login` | CMS login and role-based redirect. |
| `/admin` | Super-admin workspace. Renders `AdminDashboard` in admin mode. |
| `/editor` | Editorial workspace with permission-limited views. Renders `AdminDashboard` in editor mode. |
| `/admin/chat`, `/editor/chat` | Live support conversation workspace, with role-aware access. |
| `/admin/accept-invite` | Editorial invitation verification and password setup. |

The global header points to the main public routes and external registration portals. The gate-pass portal is `https://pass.livestockcarnival.ng`; vendor registration is `https://vendors.livestockcarnival.ng`. Treat these as externally operated destinations, not local app routes.

## 5. Homepage Experience and Current State

### Rendering flow

`src/app/page.tsx` loads local default homepage cards and default magazine copy immediately. It then requests published/enabled rows from `homepage_cards` and published `magazine` content from `site_page_content`. If the request fails or returns no acceptable cards, the local defaults stay in use. A timeout marks content ready and signals the scene reveal so a failed backend does not leave the home loading veil up indefinitely.

The page renders:

1. `HomepageCardDeck`, which owns the hero, scroll-linked card fan, and card-opening overlay.
2. Ten wide, image-led magazine features using the same card content and existing links.
3. The dark-green closing CTA with gate-pass, vendor booking, and 3-day program links.

### Deck interaction

`HomepageCardDeck.tsx` uses Framer Motion `useScroll` and `useTransform` to link the hero, card fan, and magazine handoff to scroll progress. Animation settings load from `homepage_motion_settings` and are normalized against safe ranges in `homepageMotion.ts`. The fan spreads and restacks across scroll stages; values are scroll-reversible. A card is selected on the first click/tap (raised visually) and opened on a subsequent click/tap. The open card uses a portal, flips to reveal the photo/copy/CTA, locks page scrolling, supports Escape and a focus loop, then restores scroll/focus on close.

Reduced-motion users receive a simplified/static presentation, with reduced or removed scroll transforms. Mobile sizing and deck layout are CSS-driven and responsive in `globals.css`.

### Device-performance behavior to verify

The currently checked-in `HomepageCardDeck.tsx` reads `navigator.hardwareConcurrency` into `lowPowerDevice` and uses it to limit some blur. A source comment says not to disable the scroll timeline based only on four or fewer CPU threads because that previously left the deck stuck in a static stack. In this current component there is no broad magazine-only mode based on memory/network, and no visible “Skip the 3D cards” control. This is a known difference from an earlier requested design direction. If continuing that work, decide and implement it in the current `HomepageCardDeck` architecture rather than patching an old GSAP implementation assumed from prior chat context.

The current public browser output and current source should win over this history. Inspect `HomepageCardDeck.tsx`, `page.tsx`, and current Git diff before making assumptions about card entrance, skip controls, or reduced-motion behavior.

### Magazine and CTA

Magazine feature cards are rendered by `MagazineFeature` in `src/app/page.tsx`. They use a 16:9 wide desktop layout and a responsive mobile layout, with image, card number, category/eyebrow, headline, description, and existing CTA link. Scroll progress drives image/copy opacity and text movement; reduced motion disables those scroll-linked styles. The magazine heading and theme are editable through site content. The following dark CTA is normal page content and uses the same gate-pass/vendor destinations as the header.

## 6. Content and Data Sources

### Homepage cards

`DEFAULT_HOMEPAGE_CARDS` in `src/lib/homepageCards.ts` defines ten cards. Each record includes `id`, `number`, `eyebrow`, `title`, `body`, `image`, `link`, `cta`, `pageTitle`, `coverBg`, and `accentColor`. Database rows are mapped by `mapCmsCard`. `supabase/migrations/20261003000001_homepage_cards.sql` seeds the same model and enables public reads only for published/enabled cards; editorial writes are protected by CMS authorization.

### Editable site content

`src/lib/siteContent.ts` contains defaults for editable magazine, schedule, livestock, and fashion content. The relevant `site_page_content` records are JSONB keyed by `page_key`, with published content public and editorial changes behind database policies. Current pages may layer data differently: for example, livestock first checks editable `site_page_content`, then `livestock`, then local fallback entries.

### Program, attractions, and catalogs

- `src/data/carnivalProgram.ts`: typed structured 3-day schedule data used by `ScheduleTab` as its fallback.
- `src/data/schedule.json`: older schedule representation; confirm imports before editing it.
- `src/data/attractions.json`: attraction records consumed by `/attractions`.
- `src/data/livestockCatalog.ts`: local fallback catalog entries and types.
- `src/data/fashionBreeds.ts`: local fallback breed directory.
- `src/data/carnival.json`: earlier broad site configuration and magazine content; not necessarily the active source for current home page content.
- Root `data/*.json` files and static HTML prototypes may be older duplicates. Search imports before choosing an edit target.

## 7. Supabase and CMS

### Browser and server clients

- Browser components import `supabase` from `src/lib/supabase/client.ts` or, in some older code, `src/lib/supabaseClient.ts`. These use the public project URL and publishable/anon key.
- `src/lib/supabase/server.ts` creates a server client using `SUPABASE_SERVICE_ROLE_KEY`, throws if imported in browser context, and must remain server-only.
- The CMS user-management Edge Function has its own server-side environment (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL`). Never commit or copy secret values into documentation, client bundles, chat, or browser code.
- `.env*` is ignored by Git. Read variable names from source/docs, not `.env.local` values.

### Core tables represented by migrations

| Table / resource | Purpose |
|---|---|
| `accreditations` | Press accreditation submissions and their review state. Initial schema includes identity/contact fields and a credential file URL. |
| `livestock` | Livestock catalog entries. |
| `cms_users` | Auth-linked staff profile and broad role (`super_admin` or `editorial`). |
| `cms_user_permissions` | Per-user feature permissions used to scope editorial access. |
| `media_posts` | Draft and published newsroom posts. |
| `media_galleries` | Draft and published galleries, each with a bounded JSON list of image references. |
| `homepage_cards` | Ordered, publishable homepage card records. |
| `site_page_content` | JSON content for editable page areas such as magazine, schedule, livestock, and fashion. |
| `homepage_motion_settings` | Home-deck motion configuration stored as JSON settings. |
| `site_animation_settings` | Global defaults and route-specific animation behavior. |
| `chat_threads` / `chat_messages` | Authenticated visitor support threads and messages, with RLS and intended expiry/purge behavior. |
| Storage buckets | `credentials` for accreditation files and `media-assets` for editorial images. Review bucket visibility/policies before changing sensitive uploads. |

Migrations are chronological in `supabase/migrations/`. Important current migration files include:

- `20260328000001_initial_schema.sql`: accreditation table and credentials bucket.
- `20260328000002_livestock_catalog.sql`: livestock table and image bucket policies.
- `20260930_media_cms.sql`: CMS profiles, roles, media posts, `media-assets`, and RLS.
- `20261002_live_chat.sql`: threads/messages, realtime publication, and expiry purge function.
- `20261003000000_media_galleries.sql`: photo galleries and policies.
- `20261003000001_homepage_cards.sql`: homepage card table and default seed rows.
- `20261004000000_site_content_and_motion.sql`: page content and homepage motion settings.
- `20261005000000_editor_permissions_and_site_animation.sql`: granular permissions, site animation settings, and policy revisions.
- `20261006000000_domain_staff_defaults_and_access_revocation.sql`: staff defaults and permission replacement/access revocation functions.

Use migrations as the schema source of truth. The database connected to `.env.local` may be ahead of or behind this folder; do not run migrations or destructive SQL without checking project and migration state.

### CMS roles and permissions

CMS login validates the Supabase session and looks up the user in `cms_users`. Super admins use `/admin`; editorial users use `/editor`. The super-admin-only Team Access flow invites and removes staff through `supabase/functions/cms-user-management/index.ts`. Editors receive feature permissions such as stories, galleries, media storage, homepage cards, page schedule/livestock/fashion/magazine editing, animation settings, and live chat. The canonical permission list is in `src/lib/cmsPermissions.ts`; server-side role/permission checks and RLS are the security boundary, not just hidden frontend tabs.

Setup instructions for migrations, super-admin bootstrap, invite callback URLs, and Edge Function deployment are in `supabase/MEDIA_CMS_SETUP.md`.

### Live chat

The floating `LiveChatWidget` is dynamically imported by `SiteFrame` and talks to Supabase-authenticated chat tables, including `src/app/api/chat/send/route.ts`. Admin/editor operators use `AdminLiveChatWorkspace`. The API route verifies bearer auth, applies a per-user in-memory message rate limit, sanitizes text, creates/fetches the user's thread, inserts a message, and updates thread metadata. The in-memory limiter is process-local and therefore not a distributed/global production limiter. Confirm the deployment runtime supports this route when using static export settings.

### Accreditation privacy note

The form collects a National Identity Number and a PDF credential. This is sensitive personal information. The initial migration includes public/anonymous insert and public upload policies for the accreditation flow; verify current RLS, bucket privacy, retention, staff access, and production requirements before changing or relying on this design. Do not place real application data in test prompts or logs.

## 8. Shared Components and Admin Features

- `EditablePageIntro.tsx`: page intro content that can be loaded/edited from CMS.
- `ScrollReveal.tsx`: reusable viewport-triggered reveal wrapper.
- `MagazineRow.tsx`: reusable editorial row layout from earlier page designs.
- `ThreeDCard.tsx`, `ThreeDImage.tsx`, `SlowZoomImage.tsx`, `CardStackContainer.tsx`, `ThreeDCardZoomShowcase.tsx`, and `RevealContainer.tsx`: reusable motion components. Inspect their current usage before modifying; the homepage now has its own deck component.
- `VenueMapClient.tsx`, `LeafletMap.tsx`: venue map wrapper and implementation.
- `AccreditationForm.tsx`: client validation and file submission.
- `SiteAnimationContext.tsx`: provides resolved animation settings from the site shell.
- `InitialLoadOverlay.tsx` and `BrandLoadingContent.tsx`: global loading artwork/overlay. Home page reveal behavior is coordinated with homepage-ready events; internal App Router navigation has its own page transition in `SiteFrame`.
- `components/admin/AdminDashboard.tsx`: shared dashboard for admin/editor workspace.
- `components/admin/SiteContentEditor.tsx`: CMS editing surfaces for page/site content.
- `components/admin/HomepageAnimationTuner.tsx`: controls homepage animation settings.
- `components/admin/AdminLiveChatWorkspace.tsx`: staff chat inbox.

`SiteFrame` intentionally omits the public header/footer on `/admin*` and `/editor*` workspaces. It loads site animation preferences from local cache and Supabase for public routes, applies route transition settings, and intercepts ordinary external HTTP(S) links to fade out before navigation. Avoid broad changes to this wrapper without checking both public pages and workspaces.

## 9. Visual and Interaction Conventions

The general brand system uses:

- White/off-white canvas (`#FBFBFA`) and white surfaces.
- Deep green (`#1E4D38`, `#0D4027`, and near-black forest backgrounds) for institutional accents and the CTA.
- Gold (`#D4AF37`, `#E4B03A`, `#8D6B1B`) for carnival/event emphasis.
- Charcoal text (`#111827`) and slate body text (`#4B5563`).
- Photography focused on Nigerian livestock, cultural pageantry, food, performance, venue, and agribusiness.

Keep page-specific patterns consistent: the public site is editorial but functional; controls should remain clear on narrow screens; images should use the existing public asset paths; and motion should respect reduced-motion settings. The homepage deck is a central, high-impact interaction, so changes to scroll timing, pinned scene geometry, modal focus behavior, or accessibility should be checked across desktop and mobile.

## 10. Environment Setup and Commands

Requirements: Node.js compatible with the installed Next.js 16 toolchain and npm. Dependencies are declared in `package.json` and pinned in `package-lock.json`.

```powershell
npm install
npm run dev
```

Local site: `http://localhost:3000`.

Project scripts:

```powershell
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript check
npm run build       # Next production build with webpack; output: "export" is configured
npm start           # Next start (check compatibility with output export / target deployment)
```

Potential environment variables, based on code (values intentionally omitted):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose in browser)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL` for the Supabase Edge Function runtime

Some browser modules currently contain fallback public Supabase configuration. Prefer environment configuration and avoid copying any key values into this handoff file. A publishable/anon key is designed for client use with RLS; a service-role key is privileged and must never be exposed client-side.

## 11. Asset and Script Guidance

- Place runtime images in `public/assets/` using existing naming/grouping patterns (`branding/`, `home/`, `attractions/`, `fashion-parade/`, `livestock/`, `venue-map/`, `archive/`).
- Keep alt text meaningful for informational images; use empty alt for purely decorative marks.
- `scripts/upload-media-assets.mjs` uploads prepared local assets to Supabase Storage and reads service credentials from environment files/vars. Review its paths and target bucket before use.
- `scripts/seedLivestock.js` seeds catalog records.
- `scripts/generate-fliers*.cjs` produce campaign fliers under `output/`.
- `organize-assets.js`, root HTML/JS files, and the various image-processing scripts are utilities/prototypes; understand their targets before running them.
- Do not overwrite, remove, or reorganize `assets/`, `public/assets/`, or `output/` based only on a filename or apparent duplication. Check references and Git status first.

## 12. Known Caveats and Verification Checklist

1. **Current homepage architecture:** work in `src/components/homepage/HomepageCardDeck.tsx` and `src/app/page.tsx`. Older user discussion may refer to GSAP timelines, pinned scenes, a skip button, or device/network bypasses that do not match the currently inspected component. Confirm in source before continuing old requirements.
2. **Static export and server endpoint:** `next.config.ts` enables static export, while `/api/chat/send` is a POST route handler. Confirm the target host can execute it or choose a compatible deployment arrangement.
3. **Duplicate data locations:** prefer the file actually imported by the page. Root `data/`, root HTML prototypes, and `nextjs-app/` docs may be stale.
4. **Migration state:** inspect database state and migration history before applying SQL. Migration files include RLS, storage, and account access changes.
5. **Sensitive accreditation records:** NIN and PDF submissions require careful treatment; no real PII should be pasted into a chat or test artifact.
6. **Supabase access control:** frontend visibility is not authorization. Preserve RLS and validate Edge Function role checks when editing staff/CMS functionality.
7. **Existing user changes:** inspect `git status --short` and diffs before editing. This workspace may contain user work, generated artifacts, or concurrent updates.
8. **Build and browser checks:** run focused lint/type/build checks after code changes when appropriate; for motion/layout work inspect actual desktop and mobile browser states, including keyboard, reduced-motion, scroll reversal, and slow/failing backend paths.

## 13. Suggested First Steps for a New Chat

1. Read this file and the exact feature files named by the user.
2. Run `git status --short`; preserve all existing changes and generated user artifacts.
3. Search references with `rg` to find the active data path rather than editing a similarly named duplicate.
4. If the work touches Supabase, read the relevant migration and RLS policy plus `supabase/MEDIA_CMS_SETUP.md`; never inspect or quote secret values.
5. Make the smallest cohesive change, then verify the affected route and interaction.

