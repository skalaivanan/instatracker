-- ============================================================
-- Instagram Competitor Tracker - Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable RLS (Row Level Security)
-- This ensures users can only access their own data

-- ── PROFILES ──────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── INSTAGRAM ACCOUNTS (user's own) ──────────────────────
CREATE TABLE instagram_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  instagram_user_id TEXT UNIQUE,
  username TEXT NOT NULL,
  full_name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  account_type TEXT,
  access_token TEXT,  -- encrypted in production
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ
);

ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own instagram accounts"
  ON instagram_accounts FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── COMPETITORS ───────────────────────────────────────────
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  category TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_fetched_at TIMESTAMPTZ,
  UNIQUE(user_id, username)
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own competitors"
  ON competitors FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── COMPETITOR POSTS ──────────────────────────────────────
CREATE TABLE competitor_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE NOT NULL,
  instagram_post_id TEXT,
  post_type TEXT CHECK (post_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'REEL')),
  thumbnail_url TEXT,
  media_url TEXT,
  caption TEXT,
  hashtags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  posted_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competitor_id, instagram_post_id)
);

ALTER TABLE competitor_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view posts from their competitors"
  ON competitor_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM competitors
      WHERE competitors.id = competitor_posts.competitor_id
      AND competitors.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert competitor posts"
  ON competitor_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitors
      WHERE competitors.id = competitor_posts.competitor_id
      AND competitors.user_id = auth.uid()
    )
  );

-- ── ANALYTICS SNAPSHOTS ───────────────────────────────────
CREATE TABLE competitor_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE NOT NULL,
  followers_count INTEGER,
  following_count INTEGER,
  media_count INTEGER,
  avg_likes DECIMAL(10,2),
  avg_comments DECIMAL(10,2),
  avg_views DECIMAL(10,2),
  avg_engagement_rate DECIMAL(5,2),
  snapshot_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE competitor_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their competitor snapshots"
  ON competitor_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM competitors
      WHERE competitors.id = competitor_snapshots.competitor_id
      AND competitors.user_id = auth.uid()
    )
  );

-- ── PLAN LIMITS VIEW ──────────────────────────────────────
CREATE OR REPLACE VIEW user_plan_limits AS
SELECT
  p.id,
  p.plan,
  CASE p.plan
    WHEN 'free'   THEN 3
    WHEN 'pro'    THEN 20
    WHEN 'agency' THEN 100
  END AS max_competitors,
  COUNT(c.id) AS current_competitors
FROM profiles p
LEFT JOIN competitors c ON c.user_id = p.id AND c.is_active = TRUE
GROUP BY p.id, p.plan;

-- ── INDEXES ───────────────────────────────────────────────
CREATE INDEX idx_competitors_user_id ON competitors(user_id);
CREATE INDEX idx_competitor_posts_competitor_id ON competitor_posts(competitor_id);
CREATE INDEX idx_competitor_posts_posted_at ON competitor_posts(posted_at DESC);
CREATE INDEX idx_competitor_posts_likes ON competitor_posts(likes_count DESC);
