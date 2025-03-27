// Script to apply schema.sql to Supabase
// Run with: node apply-schema.js

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function applySchema() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or key not found in .env.local file');
    process.exit(1);
  }
  
  // Initialize Supabase client with service role (if available) or anon key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Read schema.sql file
    const schemaPath = './src/utils/supabase/schema.sql';
    console.log(`Reading schema file: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema to Supabase...');
    
    // Execute the SQL (note: for production, you should split this into smaller chunks)
    const { error } = await supabase.rpc('pgql', { query: schemaSql });
    
    if (error) {
      console.error('Error applying schema:', error);
      process.exit(1);
    }
    
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

applySchema(); 