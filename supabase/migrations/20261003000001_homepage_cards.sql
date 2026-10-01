CREATE TABLE IF NOT EXISTS public.homepage_cards (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE,
  number TEXT NOT NULL DEFAULT '',
  eyebrow TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '/',
  cta TEXT NOT NULL DEFAULT 'EXPLORE',
  page_title TEXT NOT NULL DEFAULT '',
  cover_bg TEXT NOT NULL DEFAULT 'from-[#062412] via-[#0D4020] to-[#031209]',
  accent_color TEXT NOT NULL DEFAULT '#E4B03A',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.homepage_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read published homepage cards" ON public.homepage_cards;
CREATE POLICY "public read published homepage cards" ON public.homepage_cards
  FOR SELECT TO anon, authenticated
  USING ((status = 'published' AND enabled) OR public.cms_has_editor_access());
DROP POLICY IF EXISTS "editorial users insert homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users insert homepage cards" ON public.homepage_cards
  FOR INSERT TO authenticated WITH CHECK (public.cms_has_editor_access());
DROP POLICY IF EXISTS "editorial users update homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users update homepage cards" ON public.homepage_cards
  FOR UPDATE TO authenticated USING (public.cms_has_editor_access()) WITH CHECK (public.cms_has_editor_access());
DROP POLICY IF EXISTS "editorial users delete homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users delete homepage cards" ON public.homepage_cards
  FOR DELETE TO authenticated USING (public.cms_has_editor_access());
GRANT SELECT ON public.homepage_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_cards TO authenticated;

INSERT INTO public.homepage_cards (id, position, number, eyebrow, title, body, image, link, cta, page_title, cover_bg, accent_color) VALUES
('card-1',1,'01','EXHIBITION · CHAMPIONSHIP LIVESTOCK','Elite Breeds & Championship Pavilion','Explore Nigeria’s premier White Fulani bulls, Sokoto Gudali, Azawak Camels, Red Sokoto Goats, Balami Sheep, and high-yield indigenous poultry.','/assets/livestock/showcase-spectrum-hero.jpg','/livestock','EXPLORE ALL LIVESTOCK BREEDS','LIVESTOCK & CHAMPIONSHIP BREEDS','from-[#062412] via-[#0D4020] to-[#031209]','#E4B03A'),
('card-2',2,'02','RUNWAY · CULTURAL ARTS & PAGEANTRY','Livestock Cultural Fashion & Pageant','Nigeria''s first livestock fashion runway where prize cattle and camels are draped in hand-woven Aso-Oke, featuring cultural dancers and the Queen/King NLC Pageant.','/assets/attractions/cultural-fashion-runway.jpg','/fashion-parade','EXPLORE CULTURAL FASHION SHOWCASE','CULTURAL FASHION & PAGEANTRY','from-[#2A2006] via-[#4A380A] to-[#141003]','#FBBF24'),
('card-3',3,'03','NAVIGATION · ABUJA NATIONAL GROUNDS','Interactive 3D Venue Map & Zone Guide','Navigate Old Parade Ground, Abuja: Equestrian Durbar Fields, Suya Village, Live Auction Arenas, Exhibition Pavilions, VIP Lounges, and Parking Hubs.','/assets/venue-map/old-parade-ground-map-clean.jpg','/venue-map','OPEN INTERACTIVE VENUE MAP','INTERACTIVE VENUE MAP','from-[#120A3A] via-[#20125C] to-[#0B0624]','#A78BFA'),
('card-4',4,'04','ENTERTAINMENT · LIVE STAGE & ARTS','Grand Concerts & 36-State Cultural Festival','Nightly headline music concerts, traditional masquerades, 36-state cultural dance troupes, kids petting zoo, and family entertainment arenas.','/assets/home/story-live-concert-stage.jpg','/attractions','VIEW CARNIVAL ATTRACTIONS','CARNIVAL ATTRACTIONS & STAGES','from-[#0E2014] via-[#1A3824] to-[#08120B]','#34D399'),
('card-5',5,'05','DAY 1 · ROYAL CAVALRY & EQUESTRIAN','Royal Horse Cavalry & Durbar Parade','Witness over 200 ceremonial war stallions, traditional Northern horsemen, camel pageantry and royal racing displays in a breathtaking celebration of national heritage.','/assets/home/story-equestrian-durbar-parade.jpg','/schedule','VIEW DURBAR SCHEDULE','ROYAL DURBAR & PROGRAM SCHEDULE','from-[#062412] via-[#0D4020] to-[#031209]','#E4B03A'),
('card-6',6,'06','GASTRONOMY · SUYA VILLAGE & FOOD FEST','Open-Flame Suya Village & Artisanal Feast','Nigeria''s largest outdoor open-flame grilling arena featuring master Suya chefs, artisanal Kilishi, gourmet catfish BBQ, organic spice markets, and family festival dining.','/assets/home/story-suya-grill-fire.jpg','/attractions#suya-village','DISCOVER CULINARY VILLAGE','OPEN-FLAME SUYA VILLAGE','from-[#3A0A0A] via-[#5C1212] to-[#240606]','#F87171'),
('card-7',7,'07','TECHNOLOGY · NHESICS REGISTRY','National Herd Health, Security & Traceability','Discover the FGN digital herd management framework: RFID microchip tagging, real-time epidemic monitoring, biometric cattle passports, and ranch security.','/assets/home/story-digital-rfid-livestock-tag.jpg','/nhesics','EXPLORE NHESICS SYSTEM','DIGITAL RFID HERD REGISTRY','from-[#062A28] via-[#0D4845] to-[#031817]','#2DD4BF'),
('card-8',8,'08','BROADCAST · MEDIA & GALLERY','Media Gallery, Live Broadcasts & Newsroom','Access official press releases, high-definition photo galleries, video highlights, live stream feeds, and media accreditation resources.','/assets/home/story-live-concert-stage.jpg','/media','VISIT MEDIA & GALLERY PAGE','MEDIA & LIVE BROADCASTS','from-[#0E2014] via-[#1A3824] to-[#08120B]','#34D399'),
('card-9',9,'09','ACCREDITATION · VIP & PRESS PASSES','Official Accreditation & Pass Registration','Register for fast-track VIP entrance badges, international delegation clearance, press credentials, and official carnival passes.','/assets/home/story-carnival-entrance-gate.jpg','/accreditation','APPLY FOR ACCREDITATION','OFFICIAL ACCREDITATION','from-[#240A28] via-[#3E1245] to-[#150618]','#E879F9'),
('card-10',10,'10','INITIATIVE · RENEWED HOPE VISION','About the Carnival & Agricultural Heritage','Learn about the Federal Ministry of Livestock Development''s master plan to modernize agribusiness, transform pastoral livelihoods, and drive national growth.','/assets/home/story-modern-ranch-pasture.jpg','/about','READ INITIATIVE VISION','ABOUT THE CARNIVAL VISION','from-[#211904] via-[#3D2E08] to-[#120E02]','#FACC15')
ON CONFLICT (id) DO NOTHING;
