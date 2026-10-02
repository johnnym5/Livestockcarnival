# Livestock Carnival Media & Press Context

This document is an official orientation guide for journalists, media partners, publicists, editorial staff, and AI assistants working with press and media operations for the **Renewed Hope National Livestock Carnival 2026**.

**Document Date:** October 2026  
**Event Name:** Renewed Hope National Livestock Carnival 2026 (Golden Camel & Cow Carnival)  
**Official Event Dates:** 21 – 23 November 2026  
**Primary Venue:** Old Parade Ground, Area 10, Garki, Abuja, FCT, Nigeria  
**Official Portal:** [https://livestockcarnival.ng](https://livestockcarnival.ng)  
**Public Media Center:** [https://livestockcarnival.ng/media](https://livestockcarnival.ng/media)  
**Press Accreditation:** [https://livestockcarnival.ng/accreditation](https://livestockcarnival.ng/accreditation)  
**Press Directorate Contact:** `admin@livestockcarnival.ng` / `press@livestockcarnival.ng`

---

## 1. Event Vision, Purpose & Reasons

The **Renewed Hope National Livestock Carnival 2026** is the flagship national cultural, economic, and technological festival dedicated to transforming Nigeria's livestock sector. Created under the guidance of the Federal Ministry of Livestock Development and aligned with the Federal Government's Renewed Hope Agenda, the carnival serves as both a public festival and a strategic trade showcase.

### Core Strategic Goals

1. **Economic Unlocking**:
   - Unlocking Nigeria's multi-trillion Naira livestock, dairy, leather, animal feed, and meat processing industries.
   - Connecting pastoralist producers, commercial ranchers, agribusiness investors, and technology providers.

2. **Herd Health, Security & Peace (NHESICS)**:
   - Showcasing the **National Herd Health, Identification, Security, and Traceability (NHESICS)** system.
   - Promoting tech-driven herd registration, animal welfare, disease control, and conflict-mitigation frameworks to support peaceful co-existence and food security.

3. **Cultural Heritage & Pastoralist Celebration**:
   - Celebrating the rich cultural traditions of Nigeria's pastoral communities.
   - Featuring the **Livestock Cultural Fashion Parade**, horse and camel heritage displays, cultural arenas, and regional culinary festivals.

4. **Youth & Women Agribusiness Empowerment**:
   - Driving youth entrepreneurship, innovation, and digital adoption across livestock supply chains.

---

## 2. Key Event Information & Schedule Highlights

- **Event Window:** Saturday, 21 November 2026 – Monday, 23 November 2026
- **Location & Venue:** Old Parade Ground, Area 10, Garki, Abuja, FCT, Nigeria (`/venue-map`)
- **Key Tracks & Arenas:**
  - **Main Grand Arena**: Opening Ceremonies, Cultural Fashion Parades, Presidential & Ministerial Addresses.
  - **NHESICS Tech Pavilion**: Live demonstrations of livestock identification, digital health registries, and traceability tech.
  - **Exhibitor & Livestock Trade Fair**: Premium breed auctions, dairy processing exhibits, veterinary & feed technology.
  - **Flavors of the Savannah**: Traditional culinary pavilion celebrating regional livestock gastronomy.

---

## 3. Public Media Center & Press Directorate Capabilities

The platform includes a dedicated, high-performance public newsroom and media center available at `/media`.

### Key Features of the Media Center

1. **Published Newsroom Stories (`/media`)**:
   - Official press releases, communiques, festival announcements, and executive speeches.
   - Rich reading layout with cover imagery, publishing dates, category tags, and full text body.

2. **Photo & Video Galleries (`/media`)**:
   - High-resolution photo collections covering opening highlights, cultural parades, leadership visits, and livestock showcases.
   - Interactive full-screen image lightbox viewer with next/previous navigation and photo captions.

3. **Social Sharing & Deep-Linking**:
   - **One-Click Social Sharing**: Direct sharing to WhatsApp, X (Twitter), Facebook, and LinkedIn.
   - **Copy Link**: One-click URL copying with visual feedback.
   - **Deep-Linking**: Direct URL parameters (`/media?story=slug` or `/media?gallery=id`) automatically launch the corresponding story modal or gallery lightbox.

---

## 4. Press Accreditation & Journalist Registration

Journalists, broadcasters, photojournalists, and media representatives applying for official media badges must register through the press accreditation portal at `/accreditation`.

### Accreditation Requirements & Workflow

- **Required Information**: Full Name, Official Email, Phone Number, Media Organization / Outlet, Role (Reporter, Photographer, Camera Crew, Editor).
- **Documentation**: Upload of an official Assignment Letter or Media Identification Document (PDF/Image format up to 10MB).
- **Processing**: Submissions are stored securely in Supabase (`accreditations` table and `credentials` bucket) and reviewed by the Press Directorate. Verified press members receive physical badges and press pass credentials for festival access.

---

## 5. Editorial & Media Management (CMS & Storage)

Editorial staff and Press Directorate officers maintain the media center through the secure CMS workspace.

### Workspaces & Access Controls

- **Super Admin Workspace (`/admin`)**: Full system controls, team invitations, role assignments, content publishing, and live support chat.
- **Editor Workspace (`/editor`)**: Permission-governed workspace for editorial staff to write stories, curate galleries, and upload media.

### Supabase Storage Buckets

1. **`media-assets`**: Primary public CDN bucket (12 MB limit) storing story cover images and photo gallery collections.
2. **`livestock-images`**: High-capacity public bucket (50 MB limit) supporting all media types including videos (`.mp4`, `.webm`, `.mov`), high-res photography, and documents.
3. **`credentials`**: Secure bucket storing media accreditation documents and assignment letters.

### Media Storage Manager & Backend Picker

- **Media Storage Explorer**: Built-in storage browser under Admin/Editor tools supporting file previews, video playback, downloads, direct CDN links, and file deletion.
- **Backend Media Picker**: When creating new stories or galleries, editors can pick existing uploaded images directly from storage buckets or paste external image URLs without re-uploading files.

---

## 6. Official Contact & Press Inquiries

For media inquiries, interview requests with event officials, press kits, or sponsorship inquiries:

- **Official Contact Email**: `admin@livestockcarnival.ng` / `press@livestockcarnival.ng`
- **Official Website**: [https://livestockcarnival.ng](https://livestockcarnival.ng)
- **Press Secretariat**: Old Parade Ground, Area 10, Garki, Abuja, FCT, Nigeria
- **Live Support**: Interactive Live Support Chat widget available 24/7 on the website
- **Contact Form**: `/contact`
