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

-- Add the trigger to the items table
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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

-- Create a trigger for the item_images table
CREATE TRIGGER update_item_images_updated_at
BEFORE UPDATE ON item_images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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