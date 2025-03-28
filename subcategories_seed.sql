-- First, let's get the UUIDs of the parent categories
-- Note: In your actual Supabase implementation, you would replace these variables with the actual UUIDs
-- This is just to make the script more readable
DO $$
DECLARE
    construction_id UUID;
    electronics_id UUID;
    photography_id UUID;
    home_garden_id UUID;
    party_id UUID;
    sports_id UUID;
BEGIN
    SELECT id INTO construction_id FROM categories WHERE slug = 'construction-tools';
    SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
    SELECT id INTO photography_id FROM categories WHERE slug = 'film-photography';
    SELECT id INTO home_garden_id FROM categories WHERE slug = 'home-garden';
    SELECT id INTO party_id FROM categories WHERE slug = 'party';
    SELECT id INTO sports_id FROM categories WHERE slug = 'sports-leisure';

    -- Insert subcategories for Construction Tools
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('כלי עבודה חשמליים', 'power-tools', 'כלי עבודה חשמליים שונים להשכרה', '/images/categories/subcategories/power-tools.jpg', 'bg-amber-600', construction_id),
    ('סולמות ופיגומים', 'ladders-scaffolding', 'סולמות ופיגומים להשכרה', '/images/categories/subcategories/ladders.jpg', 'bg-amber-700', construction_id),
    ('ציוד לעבודות צבע', 'painting-equipment', 'כלים וציוד לעבודות צבע', '/images/categories/subcategories/painting.jpg', 'bg-amber-500', construction_id),
    ('ציוד לעבודות גינון', 'garden-tools', 'כלים לעבודות גינון', '/images/categories/subcategories/garden-tools.jpg', 'bg-amber-400', construction_id);

    -- Insert subcategories for Electronics
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('מחשבים וטאבלטים', 'computers-tablets', 'מחשבים וטאבלטים להשכרה', '/images/categories/subcategories/computers.jpg', 'bg-blue-600', electronics_id),
    ('רמקולים ומערכות סאונד', 'speakers-sound', 'רמקולים ומערכות סאונד להשכרה', '/images/categories/subcategories/speakers.jpg', 'bg-blue-700', electronics_id),
    ('טלויזיות ומקרנים', 'tvs-projectors', 'טלויזיות ומקרנים להשכרה', '/images/categories/subcategories/tvs.jpg', 'bg-blue-500', electronics_id),
    ('קונסולות משחק', 'gaming-consoles', 'קונסולות משחק להשכרה', '/images/categories/subcategories/gaming.jpg', 'bg-blue-400', electronics_id);

    -- Insert subcategories for Photography
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('מצלמות', 'cameras', 'מצלמות מקצועיות להשכרה', '/images/categories/subcategories/cameras.jpg', 'bg-purple-600', photography_id),
    ('עדשות', 'lenses', 'עדשות למצלמות להשכרה', '/images/categories/subcategories/lenses.jpg', 'bg-purple-700', photography_id),
    ('תאורה', 'lighting', 'ציוד תאורה לצילום להשכרה', '/images/categories/subcategories/lighting.jpg', 'bg-purple-500', photography_id),
    ('אביזרי צילום', 'photography-accessories', 'אביזרי צילום להשכרה', '/images/categories/subcategories/photo-accessories.jpg', 'bg-purple-400', photography_id);

    -- Insert subcategories for Home & Garden
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('ריהוט', 'furniture', 'ריהוט להשכרה', '/images/categories/subcategories/furniture.jpg', 'bg-green-600', home_garden_id),
    ('כלי מטבח', 'kitchen-appliances', 'כלי מטבח להשכרה', '/images/categories/subcategories/kitchen.jpg', 'bg-green-700', home_garden_id),
    ('ציוד גינה', 'garden-equipment', 'ציוד גינה להשכרה', '/images/categories/subcategories/garden.jpg', 'bg-green-500', home_garden_id),
    ('כלי ניקיון', 'cleaning-equipment', 'כלי ניקיון להשכרה', '/images/categories/subcategories/cleaning.jpg', 'bg-green-400', home_garden_id);

    -- Insert subcategories for Party
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('ציוד הגברה', 'sound-equipment', 'ציוד הגברה לאירועים', '/images/categories/subcategories/sound-equipment.jpg', 'bg-pink-600', party_id),
    ('שולחנות וכסאות', 'tables-chairs', 'שולחנות וכסאות להשכרה לאירועים', '/images/categories/subcategories/tables-chairs.jpg', 'bg-pink-700', party_id),
    ('תאורה לאירועים', 'party-lighting', 'תאורה לאירועים ומסיבות', '/images/categories/subcategories/party-lighting.jpg', 'bg-pink-500', party_id),
    ('אוהלים וסככות', 'tents-canopies', 'אוהלים וסככות להשכרה', '/images/categories/subcategories/tents.jpg', 'bg-pink-400', party_id);

    -- Insert subcategories for Sports & Leisure
    INSERT INTO categories (name, slug, description, image_url, color, parent_id)
    VALUES 
    ('אופניים', 'bicycles', 'אופניים להשכרה', '/images/categories/subcategories/bicycles.jpg', 'bg-red-600', sports_id),
    ('ציוד קמפינג', 'camping-gear', 'ציוד קמפינג להשכרה', '/images/categories/subcategories/camping.jpg', 'bg-red-700', sports_id),
    ('ציוד ספורט ימי', 'water-sports', 'ציוד ספורט ימי להשכרה', '/images/categories/subcategories/water-sports.jpg', 'bg-red-500', sports_id),
    ('כושר וספורט', 'fitness-equipment', 'ציוד כושר וספורט להשכרה', '/images/categories/subcategories/fitness.jpg', 'bg-red-400', sports_id);

END $$; 