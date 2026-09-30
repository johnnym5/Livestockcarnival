-- Migration: Initial Schema for Accreditation & Storage
-- Created: 2026-03-28

-- 1. Create accreditations table
CREATE TABLE IF NOT EXISTS public.accreditations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    nin VARCHAR(11) NOT NULL,
    email TEXT NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.accreditations ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public/anon insertion
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'accreditations'
        AND policyname = 'Allow public insert to accreditations'
    ) THEN
        CREATE POLICY "Allow public insert to accreditations"
        ON public.accreditations
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- 4. Create credentials storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('credentials', 'credentials', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Policy: Allow public uploads to credentials bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND policyname = 'Allow public upload to credentials bucket'
    ) THEN
        CREATE POLICY "Allow public upload to credentials bucket"
        ON storage.objects
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (bucket_id = 'credentials');
    END IF;
END $$;
