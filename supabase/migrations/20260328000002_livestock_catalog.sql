-- Migration: Livestock Catalog & Storage Bucket
-- Created: 2026-03-28

-- 1. Create livestock-images Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('livestock-images', 'livestock-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Public Read Policy for livestock-images Bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND policyname = 'Allow public select on livestock-images'
    ) THEN
        CREATE POLICY "Allow public select on livestock-images"
        ON storage.objects
        FOR SELECT
        TO anon, authenticated
        USING (bucket_id = 'livestock-images');
    END IF;
END $$;

-- 3. Create livestock Table
CREATE TABLE IF NOT EXISTS public.livestock (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    breed TEXT,
    category TEXT NOT NULL CHECK (category IN ('camels', 'horses', 'cattle', 'small-ruminants')),
    age TEXT,
    exhibitor TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Select Policy for livestock Table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'livestock'
        AND policyname = 'Allow public select on livestock'
    ) THEN
        CREATE POLICY "Allow public select on livestock"
        ON public.livestock
        FOR SELECT
        TO anon, authenticated
        USING (true);
    END IF;
END $$;

-- 6. Seed Initial Golden Camel & Livestock Catalog Data
INSERT INTO public.livestock (name, breed, category, age, exhibitor, description, image_url, is_featured)
VALUES
(
    'Rajputana Gold',
    'Bikaneri Dromedary',
    'camels',
    '5 Years',
    'Golden Camel Estate',
    'Championship breeding dromedary known for high endurance, distinctive golden coat, and grand ceremonial posture.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/livestock_camel.jpg',
    true
),
(
    'Cheetak Lineage',
    'Marwari Stallion',
    'horses',
    '4 Years',
    'Kano Durbar Cavalry',
    'Famous inward-turning ears, athletic build, and heritage lineage trained for ceremonial Durbar parades.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/durbar_horse_rider.jpg',
    true
),
(
    'Nandi Crest',
    'White Fulani Zebu',
    'cattle',
    '6 Years',
    'National Livestock Ranch',
    'Prize-winning indigenous Zebu bull with iconic lyre-shaped horns, robust heat tolerance, and premium genetics.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/livestock_bull_cow.jpg',
    true
),
(
    'Sultan of Pushkar',
    'Jaisalmeri Camel',
    'camels',
    '7 Years',
    'Desert Crown Stud',
    'Celebrated desert racing and parade camel featuring exceptional speed, tall stature, and royal saddle dress.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/livestock_camel.jpg',
    false
),
(
    'Sokoto Gudali Prime',
    'Sokoto Gudali Bull',
    'cattle',
    '5 Years',
    'Northwest Cattle Alliance',
    'Deep-bodied beef bull with smooth white coat, well-developed dewlap, and high live-weight yield certification.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/livestock_spectrum_hero.jpg',
    false
),
(
    'Borno Royal Stallion',
    'Arewa Thoroughbred',
    'horses',
    '3 Years',
    'Borno Emirate Cavalry',
    'High-spirited parade stallion with silver embroidery harness, trained for precision equestrian maneuvers.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/kano_durbar.jpg',
    false
),
(
    'Kano Red Dwarf',
    'Balami Red Sheep',
    'small-ruminants',
    '2 Years',
    'Sahel Livestock Co-op',
    'Large-framed desert sheep breed with pendulous ears, prized for breeding quality and high mutton output.',
    'https://bqwohpjschaditdkrdra.supabase.co/storage/v1/object/public/livestock-images/livestock_goat_sheep.jpg',
    false
)
ON CONFLICT (id) DO NOTHING;
