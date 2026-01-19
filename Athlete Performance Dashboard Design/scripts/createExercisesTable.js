const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://svdznqczeedptnmwopem.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZHpucWN6ZWVkcHRubXdvcGVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODczNjUyOSwiZXhwIjoyMDQ0MzEyNTI5fQ.w_pGQGY-09OKbGS4QGQs2taMRQkqQ5pFhyoQm8ZLhXI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createExercisesTable() {
  try {
    console.log('Creating exercises table...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'CREATE_EXERCISES_TABLE.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.startsWith('--')) continue;

      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      // Execute the statement using raw SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).catch(async (err) => {
        // If the RPC doesn't exist, try using the raw SQL endpoint
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: statement
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { data: await response.json(), error: null };
      });

      if (error) {
        // Check if it's a "already exists" error which we can ignore
        if (error.message?.includes('already exists') ||
            error.message?.includes('duplicate')) {
          console.log(`Warning: ${error.message} (continuing...)`);
        } else {
          console.error('Error executing statement:', error);
          // Continue with other statements even if one fails
        }
      }
    }

    // Verify the table was created
    const { data: tables, error: checkError } = await supabase
      .from('exercises')
      .select('count')
      .limit(1);

    if (checkError) {
      console.log('Note: Could not verify table creation:', checkError.message);
      console.log('Please check your Supabase dashboard to confirm the exercises table was created.');
    } else {
      console.log('✅ Exercises table created successfully!');

      // Count exercises
      const { count } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true });

      console.log(`✅ Added ${count} exercises to the database`);
    }

  } catch (error) {
    console.error('Error creating exercises table:', error);
    console.log('\n⚠️  If the script failed, you can manually execute the SQL in your Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/project/svdznqczeedptnmwopem/sql');
    console.log('2. Copy the contents of CREATE_EXERCISES_TABLE.sql');
    console.log('3. Paste and run it in the SQL editor');
  }
}

createExercisesTable();