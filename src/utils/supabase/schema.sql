-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  full_name TEXT,
  phone TEXT,
  alternative_email TEXT,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_postal_code TEXT,
  address_country TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_account_id TEXT,
  stripe_onboarding_completed BOOLEAN DEFAULT FALSE,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_rentals INTEGER DEFAULT 0
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profile access (with checks to avoid duplicates)
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Create function to handle creating a profile when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING; -- Avoid duplicate entries
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profile's updated_at when a profile is updated
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists before creating it
DROP TRIGGER IF EXISTS profile_updated_at ON profiles;
CREATE TRIGGER profile_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profile_updated_at(); 