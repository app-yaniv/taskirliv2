-- ======================================
-- RENTAL PLATFORM DATABASE SCHEMA
-- For use with Supabase
-- ======================================

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================
-- CATEGORIES
-- ======================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  parent_id UUID REFERENCES categories(id),
  popular BOOLEAN DEFAULT false,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);

-- Create an index on parent_id for faster parent-child queries
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);

-- Add the trigger to the categories table
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "Categories can be inserted by admins" 
ON categories FOR INSERT 
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Categories can be updated by admins" 
ON categories FOR UPDATE 
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Categories can be deleted by admins" 
ON categories FOR DELETE 
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ======================================
-- ITEMS
-- ======================================

-- Items table for rental listings
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price_per_day INTEGER NOT NULL,
  price_per_three_days INTEGER,
  price_per_seven_days INTEGER,
  location TEXT NOT NULL,
  location_lat NUMERIC,
  location_lng NUMERIC,
  item_value INTEGER NOT NULL,
  deposit_amount INTEGER,
  cancellation_policy TEXT NOT NULL DEFAULT 'flexible',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on owner_id for faster lookups of user's listings
CREATE INDEX IF NOT EXISTS items_owner_id_idx ON items(owner_id);

-- Create index on status for filtering active/inactive listings
CREATE INDEX IF NOT EXISTS items_status_idx ON items(status);

-- Add the trigger to the items table
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active items
CREATE POLICY "Active items are viewable by everyone" 
ON items FOR SELECT 
USING (status = 'active');

-- Owners can view all their own items regardless of status
CREATE POLICY "Owners can view all their own items" 
ON items FOR SELECT 
TO authenticated
USING (owner_id = auth.uid());

-- Owners can insert their own items
CREATE POLICY "Owners can insert their own items" 
ON items FOR INSERT 
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Owners can update their own items
CREATE POLICY "Owners can update their own items" 
ON items FOR UPDATE 
TO authenticated
USING (owner_id = auth.uid());

-- Owners can delete their own items
CREATE POLICY "Owners can delete their own items" 
ON items FOR DELETE 
TO authenticated
USING (owner_id = auth.uid());

-- Admins can manage all items
CREATE POLICY "Admins can manage all items" 
ON items 
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ======================================
-- ITEM IMAGES
-- ======================================

-- Create a table for item images
CREATE TABLE IF NOT EXISTS item_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on item_id for faster lookups
CREATE INDEX IF NOT EXISTS item_images_item_id_idx ON item_images(item_id);

-- Create a trigger for the item_images table
CREATE TRIGGER update_item_images_updated_at
BEFORE UPDATE ON item_images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for item_images
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view images of active items
CREATE POLICY "Images of active items are viewable by everyone" 
ON item_images FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_images.item_id 
    AND items.status = 'active'
  )
);

-- Owners can view all their own item images
CREATE POLICY "Owners can view all their own item images" 
ON item_images FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_images.item_id 
    AND items.owner_id = auth.uid()
  )
);

-- Owners can insert images for their own items
CREATE POLICY "Owners can insert images for their own items" 
ON item_images FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_images.item_id 
    AND items.owner_id = auth.uid()
  )
);

-- Owners can update images for their own items
CREATE POLICY "Owners can update images for their own items" 
ON item_images FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_images.item_id 
    AND items.owner_id = auth.uid()
  )
);

-- Owners can delete images for their own items
CREATE POLICY "Owners can delete images for their own items" 
ON item_images FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_images.item_id 
    AND items.owner_id = auth.uid()
  )
);

-- ======================================
-- ITEM CATEGORIES (many-to-many)
-- ======================================

-- Create a link between items and categories
CREATE TABLE IF NOT EXISTS item_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, category_id)
);

-- Create a trigger for the item_categories table
CREATE TRIGGER update_item_categories_updated_at
BEFORE UPDATE ON item_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for item_categories
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view item categories
CREATE POLICY "Item categories are viewable by everyone" 
ON item_categories FOR SELECT 
USING (true);

-- Only the item owner and admins can manage item categories
CREATE POLICY "Item categories can be inserted by item owner" 
ON item_categories FOR INSERT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_categories.item_id 
    AND (items.owner_id = auth.uid() OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  )
);

CREATE POLICY "Item categories can be updated by item owner" 
ON item_categories FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_categories.item_id 
    AND (items.owner_id = auth.uid() OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  )
);

CREATE POLICY "Item categories can be deleted by item owner" 
ON item_categories FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.id = item_categories.item_id 
    AND (items.owner_id = auth.uid() OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  )
);

-- ======================================
-- VIEWS
-- ======================================

-- Create a view to easily get items with their categories
CREATE OR REPLACE VIEW items_with_categories AS
SELECT 
  i.*,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'image_url', c.image_url,
        'color', c.color
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::jsonb
  ) as categories
FROM 
  items i
LEFT JOIN 
  item_categories ic ON i.id = ic.item_id
LEFT JOIN 
  categories c ON ic.category_id = c.id
GROUP BY 
  i.id;

-- Create a view to easily get items with their images
CREATE OR REPLACE VIEW items_with_images AS
SELECT 
  i.*,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', img.id,
        'image_url', img.image_url,
        'position', img.position,
        'is_primary', img.is_primary
      ) ORDER BY img.is_primary DESC, img.position ASC
    ) FILTER (WHERE img.id IS NOT NULL),
    '[]'::jsonb
  ) as images
FROM 
  items i
LEFT JOIN 
  item_images img ON i.id = img.item_id
GROUP BY 
  i.id;

-- Create a complete view with items, categories and images
CREATE OR REPLACE VIEW complete_items AS
SELECT 
  i.*,
  ic.categories,
  ii.images
FROM 
  items i
LEFT JOIN 
  items_with_categories ic ON i.id = ic.id
LEFT JOIN 
  items_with_images ii ON i.id = ii.id;

-- ======================================
-- SEED DATA
-- ======================================

-- Seed data for main categories
INSERT INTO categories (name, slug, description, image_url, color, popular)
VALUES 
('ציוד בנייה וכלי עבודה', 'construction-tools', 'כל סוגי ציוד הבנייה וכלי העבודה להשכרה', '/images/categories/construction-tools.jpg', 'bg-amber-500', true),
('אלקטרוניקה', 'electronics', 'מגוון מוצרי אלקטרוניקה להשכרה', '/images/categories/electronics.jpg', 'bg-blue-500', true),
('סרטים וצילום', 'film-photography', 'ציוד צילום ווידאו מקצועי להשכרה', '/images/categories/photography.jpg', 'bg-purple-500', true),
('בית וגינה', 'home-garden', 'ציוד לבית ולגינה להשכרה', '/images/categories/home-garden.jpg', 'bg-green-500', true),
('אירועים ומסיבות', 'party', 'ציוד לאירועים ומסיבות להשכרה', '/images/categories/party.jpg', 'bg-pink-500', true),
('ספורט ופנאי', 'sports-leisure', 'ציוד ספורט ופנאי להשכרה', '/images/categories/sports.jpg', 'bg-red-500', true);

-- ======================================
-- FUNCTIONS & PROCEDURES (Optional)
-- ======================================

-- Create a function to update a listing's status
CREATE OR REPLACE FUNCTION update_item_status(item_id UUID, new_status TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE items
  SET status = new_status, updated_at = NOW()
  WHERE id = item_id AND (owner_id = auth.uid() OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get a user's items
CREATE OR REPLACE FUNCTION get_user_items(user_id UUID)
RETURNS SETOF complete_items AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM complete_items
  WHERE owner_id = user_id AND (
    owner_id = auth.uid() OR 
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 