# Taskirli Rental Platform - Supabase Database Setup

This folder contains SQL files to set up and configure the database for the Taskirli rental platform using Supabase.

## Files Overview

1. **complete_rental_platform_schema.sql** - The complete database schema in a single file. This includes all tables, indices, RLS policies, views and seed data for the main categories.

2. **categories_schema.sql** - The categories table structure and main category seed data.

3. **subcategories_seed.sql** - Seed data for subcategories (run this after the main categories are created).

4. **items_schema.sql** - The items and item_images tables structure.

## How to Use These Files

### Option 1: Complete Setup

1. Log in to your Supabase project
2. Navigate to the SQL Editor
3. Open the `complete_rental_platform_schema.sql` file
4. Run the SQL to create all tables and seed the main categories
5. If you want to add subcategories, run the `subcategories_seed.sql` file

### Option 2: Step-by-Step Setup

If you prefer to set up the database components individually:

1. First run `categories_schema.sql` to create the categories structure
2. Then run `items_schema.sql` to create the items structure
3. Finally run `subcategories_seed.sql` to add the subcategories

## Database Structure

The database consists of the following main components:

### Categories

- `categories` - Stores all product categories and subcategories
  - Has parent-child relationships (parent_id)
  - Includes a "popular" flag for featured categories
  - Contains color information for UI display

### Items (Rental Listings)

- `items` - Stores rental listings
  - Includes tiered pricing (daily, 3-day, 7-day)
  - Tracks item value and deposit amount
  - Stores cancellation policy
  - Includes status field for active/inactive listings

- `item_images` - Stores images for rental items
  - Tracks image position and primary status
  - Connected to items through item_id

- `item_categories` - Many-to-many relationship between items and categories

### Views

- `items_with_categories` - Items with their categories as a JSON array
- `items_with_images` - Items with their images as a JSON array
- `complete_items` - Complete item data including categories and images

### Helper Functions

- `update_item_status` - Update an item's status (active/inactive)
- `get_user_items` - Get all items for a specific user

## Security

All tables have Row Level Security (RLS) policies:

- Categories are viewable by everyone but can only be managed by admins
- Items can be viewed by everyone if active, but only the owner can see inactive items
- Item management (create/update/delete) is restricted to the owner
- Admins have full management access to all data

## Notes

- The schema uses UUIDs for all primary keys
- Timestamps (created_at, updated_at) are automatically managed
- The schema assumes you're using Supabase Auth for user management 