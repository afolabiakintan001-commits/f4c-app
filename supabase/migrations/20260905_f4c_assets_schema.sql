-- Create 'images' table
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    file_type TEXT NOT NULL,
    tags TEXT[],
    preview_url TEXT NOT NULL,
    master_file_url TEXT NOT NULL,
    resolution TEXT,
    access_type TEXT NOT NULL CHECK (access_type IN ('FREE', 'FULLY_FREE', 'MONEY')) DEFAULT 'FREE',
    price_gbp NUMERIC(10, 2) DEFAULT 0.00
);

-- Enable RLS on images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images
CREATE POLICY "Public read access to images" ON images FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert own images" ON images 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their own images" ON images 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their own images" ON images 
FOR DELETE USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_category ON images (category);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images (user_id);
CREATE INDEX IF NOT EXISTS idx_images_tags ON images USING GIN (tags);

-- Storage Bucket Configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public read access to assets bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload to own folder in assets" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'assets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can update/delete own objects in assets" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'assets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can delete own objects in assets" ON storage.objects
FOR DELETE USING (
    bucket_id = 'assets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);
