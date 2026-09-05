-- PostgreSQL function to get top creators in the last 7 days
CREATE OR REPLACE FUNCTION get_top_creators_this_week()
RETURNS TABLE (
    profile_id UUID,
    username TEXT,
    avatar_url TEXT,
    total_downloads BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS profile_id,
        p.username,
        p.avatar_url,
        SUM(i.download_count) AS total_downloads
    FROM 
        profiles p
    JOIN 
        images i ON p.id = i.creator_id
    WHERE 
        i.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY 
        p.id, p.username, p.avatar_url
    ORDER BY 
        total_downloads DESC
    LIMIT 4;
END;
$$ LANGUAGE plpgsql;

-- Seed Script
-- NOTE: Execute these in order or wrap in a transaction if your schema allows
INSERT INTO profiles (id, username, avatar_url, is_creator) VALUES
(gen_random_uuid(), 'anime_master', 'https://example.com/avatar1.jpg', true),
(gen_random_uuid(), 'car_photog', 'https://example.com/avatar2.jpg', true),
(gen_random_uuid(), 'texture_wiz', 'https://example.com/avatar3.jpg', true),
(gen_random_uuid(), 'graphic_pro', 'https://example.com/avatar4.jpg', true),
(gen_random_uuid(), 'street_snaps', 'https://example.com/avatar5.jpg', true),
(gen_random_uuid(), 'art_vibes', 'https://example.com/avatar6.jpg', true);

-- Assuming profiles were created, fetch their IDs to insert images
INSERT INTO images (id, creator_id, title, url, access_type, point_cost, download_count, created_at)
SELECT 
    gen_random_uuid(), 
    p.id, 
    'Asset ' || gs, 
    'https://r2.vault.com/image' || gs || '.png', 
    (ARRAY['MONEY', 'FREE', 'FULLY_FREE'])[floor(random() * 3 + 1)],
    floor(random() * 100),
    floor(random() * 1000),
    NOW() - (random() * INTERVAL '10 days')
FROM 
    profiles p, 
    generate_series(1, 2) gs
LIMIT 12;
