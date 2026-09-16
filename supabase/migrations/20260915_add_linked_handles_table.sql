-- Add linked_handles table
CREATE TABLE linked_handles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('TikTok', 'Instagram', 'X', 'YouTube')),
  handle TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, handle)
);

CREATE INDEX idx_linked_handles_handle ON linked_handles(handle);
CREATE INDEX idx_linked_handles_creator_id ON linked_handles(creator_id);
