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

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the trigger to the categories table
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed data for main categories
INSERT INTO categories (name, slug, description, image_url, color, popular)
VALUES 
('ציוד בנייה וכלי עבודה', 'construction-tools', 'כל סוגי ציוד הבנייה וכלי העבודה להשכרה', '/images/categories/construction-tools.jpg', 'bg-amber-500', true),
('אלקטרוניקה', 'electronics', 'מגוון מוצרי אלקטרוניקה להשכרה', '/images/categories/electronics.jpg', 'bg-blue-500', true),
('סרטים וצילום', 'film-photography', 'ציוד צילום ווידאו מקצועי להשכרה', '/images/categories/photography.jpg', 'bg-purple-500', true),
('בית וגינה', 'home-garden', 'ציוד לבית ולגינה להשכרה', '/images/categories/home-garden.jpg', 'bg-green-500', true),
('אירועים ומסיבות', 'party', 'ציוד לאירועים ומסיבות להשכרה', '/images/categories/party.jpg', 'bg-pink-500', true),
('ספורט ופנאי', 'sports-leisure', 'ציוד ספורט ופנאי להשכרה', '/images/categories/sports.jpg', 'bg-red-500', true);

-- Create a link between items and categories
CREATE TABLE IF NOT EXISTS item_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, category_id)
);

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

-- Trigger for updated_at on item_categories
CREATE TRIGGER update_item_categories_updated_at
BEFORE UPDATE ON item_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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