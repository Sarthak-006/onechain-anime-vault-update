-- Supabase Schema for Anime NFT Marketplace
-- Run this in your Supabase SQL Editor

-- Create nfts table
CREATE TABLE IF NOT EXISTS nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_object_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL,
    series TEXT,
    character TEXT,
    manufacturer TEXT,
    release_year INTEGER,
    condition TEXT,
    owner_address TEXT NOT NULL,
    creator_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'minted' CHECK (status IN ('minted', 'listed', 'owned', 'sold')),
    price_oct NUMERIC,
    listing_price_oct NUMERIC,
    listing_id TEXT,
    mint_tx_digest TEXT,
    list_tx_digest TEXT,
    purchase_tx_digest TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nft_transactions table
CREATE TABLE IF NOT EXISTS nft_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_object_id TEXT NOT NULL REFERENCES nfts(nft_object_id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('mint', 'list', 'purchase')),
    tx_digest TEXT NOT NULL,
    actor_address TEXT NOT NULL,
    price_oct NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nfts_owner_address ON nfts(owner_address);
CREATE INDEX IF NOT EXISTS idx_nfts_status ON nfts(status);
CREATE INDEX IF NOT EXISTS idx_nfts_listing_id ON nfts(listing_id);
CREATE INDEX IF NOT EXISTS idx_nfts_created_at ON nfts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nft_transactions_nft_object_id ON nft_transactions(nft_object_id);
CREATE INDEX IF NOT EXISTS idx_nft_transactions_actor_address ON nft_transactions(actor_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_nfts_updated_at BEFORE UPDATE ON nfts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for nfts" ON nfts
    FOR SELECT USING (true);

CREATE POLICY "Public read access for nft_transactions" ON nft_transactions
    FOR SELECT USING (true);

-- Create policies for authenticated insert/update
CREATE POLICY "Authenticated insert for nfts" ON nfts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated update for nfts" ON nfts
    FOR UPDATE USING (true);

CREATE POLICY "Authenticated insert for nft_transactions" ON nft_transactions
    FOR INSERT WITH CHECK (true);

