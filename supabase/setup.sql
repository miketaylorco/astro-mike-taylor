-- Supabase Setup Script for Protected Content System
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- 1. CREATE TABLES
-- =============================================================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article access permissions
CREATE TABLE IF NOT EXISTS public.article_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sanity_document_id TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, sanity_document_id)
);

-- Access logs for tracking
CREATE TABLE IF NOT EXISTS public.content_access_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sanity_document_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- =============================================================================
-- 2. CREATE INDEXES
-- =============================================================================

-- Index for faster article access lookups
CREATE INDEX IF NOT EXISTS idx_article_access_user_id ON public.article_access(user_id);
CREATE INDEX IF NOT EXISTS idx_article_access_document_id ON public.article_access(sanity_document_id);
CREATE INDEX IF NOT EXISTS idx_article_access_user_document ON public.article_access(user_id, sanity_document_id);

-- Index for access log queries
CREATE INDEX IF NOT EXISTS idx_content_access_log_user_id ON public.content_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_content_access_log_accessed_at ON public.content_access_log(accessed_at DESC);

-- =============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_access_log ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 4. CREATE RLS POLICIES
-- =============================================================================

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Article Access: Users can view their own access records
CREATE POLICY "Users can view own access" ON public.article_access
  FOR SELECT USING (auth.uid() = user_id);

-- Content Access Log: Users can view their own access history
CREATE POLICY "Users can view own access history" ON public.content_access_log
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- 5. CREATE FUNCTION TO HANDLE NEW USER SIGNUP
-- =============================================================================

-- This function automatically creates a profile when a user is invited
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.article_access TO authenticated;
GRANT SELECT ON public.content_access_log TO authenticated;

-- Service role has full access (used by admin operations)
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.article_access TO service_role;
GRANT ALL ON public.content_access_log TO service_role;

-- =============================================================================
-- VERIFICATION QUERIES (run these to verify setup)
-- =============================================================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies exist
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
