const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://svdznqczeedptnmwopem.supabase.co';
// Using service role key for admin access to create tables
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZHpucWN6ZWVkcHRubXdvcGVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODczNjUyOSwiZXhwIjoyMDQ0MzEyNTI5fQ.w_pGQGY-09OKbGS4QGQs2taMRQkqQ5pFhyoQm8ZLhXI';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

async function setupExercisesTable() {
  console.log('🚀 Setting up exercises table for AI training plan generation...\n');

  try {
    // First check if table exists
    console.log('Checking if exercises table already exists...');
    const { data: existingExercises, error: checkError } = await supabase
      .from('exercises')
      .select('id')
      .limit(1);

    if (!checkError) {
      // Table exists, check if it has data
      const { count } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true });

      if (count > 0) {
        console.log(`✅ Exercises table already exists with ${count} exercises!`);
        console.log('✅ AI training plan generation should be working!\n');
        return;
      } else {
        console.log('Table exists but is empty. Adding exercises...');
      }
    } else {
      console.log('Table does not exist. Creating it now...');

      // Create the table structure
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS exercises (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          muscle_groups TEXT[],
          equipment_needed TEXT[],
          difficulty_level VARCHAR(50),
          sport_specificity TEXT[],
          instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // We can't execute raw SQL through the JS client directly,
      // but we can insert data if the table exists
      console.log('\n❌ Cannot create table directly from Node.js client.');
      console.log('The table needs to be created through the Supabase Dashboard.\n');
      console.log('Please follow these steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/svdznqczeedptnmwopem/sql');
      console.log('2. Copy the contents of CREATE_EXERCISES_TABLE.sql');
      console.log('3. Paste and run it in the SQL editor\n');
      return;
    }

    // If we get here, table exists but needs data
    console.log('Adding sample exercises to the database...');

    const exercises = [
      // Strength exercises
      { name: 'Barbell Squat', category: 'strength', muscle_groups: ['quadriceps', 'glutes', 'hamstrings'], equipment_needed: ['barbell', 'squat rack'], difficulty_level: 'intermediate', sport_specificity: ['football', 'basketball', 'soccer'], instructions: 'Position the barbell on your upper back, descend by bending knees and hips, then drive up through heels' },
      { name: 'Bench Press', category: 'strength', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment_needed: ['barbell', 'bench'], difficulty_level: 'intermediate', sport_specificity: ['football', 'basketball', 'baseball'], instructions: 'Lower the bar to chest level with control, then press up to full extension' },
      { name: 'Deadlift', category: 'strength', muscle_groups: ['hamstrings', 'glutes', 'lower back'], equipment_needed: ['barbell'], difficulty_level: 'intermediate', sport_specificity: ['football', 'track', 'wrestling'], instructions: 'Hinge at hips, grip bar, drive through heels while maintaining neutral spine' },
      { name: 'Power Clean', category: 'strength', muscle_groups: ['full body'], equipment_needed: ['barbell'], difficulty_level: 'advanced', sport_specificity: ['football', 'basketball', 'track'], instructions: 'Explosive pull from floor, catch in front rack position' },
      { name: 'Pull-ups', category: 'strength', muscle_groups: ['back', 'biceps'], equipment_needed: ['pull-up bar'], difficulty_level: 'intermediate', sport_specificity: ['all'], instructions: 'Hang from bar, pull body up until chin clears bar' },
      { name: 'Push-ups', category: 'strength', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment_needed: ['none'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Maintain plank position, lower chest to floor, push back up' },
      { name: 'Dumbbell Lunges', category: 'strength', muscle_groups: ['quadriceps', 'glutes'], equipment_needed: ['dumbbells'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Step forward, lower back knee toward ground, drive through front heel to return' },
      { name: 'Plank', category: 'strength', muscle_groups: ['core'], equipment_needed: ['none'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Hold push-up position on forearms, maintain straight line from head to heels' },

      // Cardio exercises
      { name: 'Sprint Intervals', category: 'cardio', muscle_groups: ['full body'], equipment_needed: ['track or field'], difficulty_level: 'intermediate', sport_specificity: ['football', 'soccer', 'basketball'], instructions: 'Sprint at 90-95% effort for specified distance, recover, repeat' },
      { name: 'Shuttle Runs', category: 'cardio', muscle_groups: ['legs', 'cardiovascular'], equipment_needed: ['cones'], difficulty_level: 'intermediate', sport_specificity: ['basketball', 'soccer', 'tennis'], instructions: 'Sprint to cone, touch ground, sprint back, repeat' },
      { name: 'Bike Intervals', category: 'cardio', muscle_groups: ['legs', 'cardiovascular'], equipment_needed: ['stationary bike'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Alternate between high intensity and recovery periods' },
      { name: 'Rowing Machine', category: 'cardio', muscle_groups: ['full body'], equipment_needed: ['rowing machine'], difficulty_level: 'intermediate', sport_specificity: ['all'], instructions: 'Drive with legs, lean back, pull with arms, return in reverse order' },
      { name: 'Jump Rope', category: 'cardio', muscle_groups: ['calves', 'cardiovascular'], equipment_needed: ['jump rope'], difficulty_level: 'beginner', sport_specificity: ['boxing', 'basketball'], instructions: 'Jump with both feet, land softly, maintain rhythm' },

      // Plyometric exercises
      { name: 'Box Jumps', category: 'plyometric', muscle_groups: ['legs', 'glutes'], equipment_needed: ['plyometric box'], difficulty_level: 'intermediate', sport_specificity: ['basketball', 'volleyball', 'football'], instructions: 'Jump explosively onto box, step down, repeat' },
      { name: 'Medicine Ball Slams', category: 'plyometric', muscle_groups: ['core', 'shoulders'], equipment_needed: ['medicine ball'], difficulty_level: 'intermediate', sport_specificity: ['all'], instructions: 'Raise ball overhead, slam down with force, catch and repeat' },
      { name: 'Depth Jumps', category: 'plyometric', muscle_groups: ['legs'], equipment_needed: ['plyometric box'], difficulty_level: 'advanced', sport_specificity: ['basketball', 'volleyball'], instructions: 'Step off box, land and immediately jump vertically' },
      { name: 'Broad Jumps', category: 'plyometric', muscle_groups: ['legs', 'glutes'], equipment_needed: ['none'], difficulty_level: 'intermediate', sport_specificity: ['track', 'football'], instructions: 'Jump forward as far as possible, land softly' },
      { name: 'Burpees', category: 'plyometric', muscle_groups: ['full body'], equipment_needed: ['none'], difficulty_level: 'intermediate', sport_specificity: ['all'], instructions: 'Squat, jump back to plank, push-up, jump feet to hands, jump up' },

      // Agility exercises
      { name: 'Ladder Drills', category: 'agility', muscle_groups: ['legs', 'coordination'], equipment_needed: ['agility ladder'], difficulty_level: 'beginner', sport_specificity: ['soccer', 'basketball', 'tennis'], instructions: 'Various footwork patterns through ladder rungs' },
      { name: 'Cone Drills', category: 'agility', muscle_groups: ['legs', 'coordination'], equipment_needed: ['cones'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Change direction quickly around cone pattern' },
      { name: 'T-Drill', category: 'agility', muscle_groups: ['legs'], equipment_needed: ['cones'], difficulty_level: 'intermediate', sport_specificity: ['basketball', 'soccer', 'tennis'], instructions: 'Sprint forward, shuffle laterally, backpedal in T pattern' },
      { name: '5-10-5 Drill', category: 'agility', muscle_groups: ['legs'], equipment_needed: ['cones'], difficulty_level: 'intermediate', sport_specificity: ['football', 'basketball'], instructions: 'Sprint 5 yards, change direction, sprint 10 yards, change direction, sprint 5 yards' },

      // Flexibility exercises
      { name: 'Dynamic Warm-up', category: 'flexibility', muscle_groups: ['full body'], equipment_needed: ['none'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Leg swings, arm circles, walking lunges, high knees' },
      { name: 'Static Stretching', category: 'flexibility', muscle_groups: ['full body'], equipment_needed: ['none'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Hold stretches for 20-30 seconds per muscle group' },
      { name: 'Foam Rolling', category: 'flexibility', muscle_groups: ['full body'], equipment_needed: ['foam roller'], difficulty_level: 'beginner', sport_specificity: ['all'], instructions: 'Roll slowly over muscle groups to release tension' },
      { name: 'Yoga Flow', category: 'flexibility', muscle_groups: ['full body'], equipment_needed: ['yoga mat'], difficulty_level: 'intermediate', sport_specificity: ['all'], instructions: 'Series of yoga poses for flexibility and balance' },

      // Sport-specific exercises
      { name: 'Quarterback Drops', category: 'skill', muscle_groups: ['legs', 'coordination'], equipment_needed: ['none'], difficulty_level: 'intermediate', sport_specificity: ['football'], instructions: '3-step, 5-step, and 7-step drops with proper footwork' },
      { name: 'Dribbling Drills', category: 'skill', muscle_groups: ['coordination'], equipment_needed: ['basketball'], difficulty_level: 'beginner', sport_specificity: ['basketball'], instructions: 'Crossovers, between legs, behind back dribbling patterns' },
      { name: 'Batting Practice', category: 'skill', muscle_groups: ['core', 'arms'], equipment_needed: ['bat', 'balls'], difficulty_level: 'intermediate', sport_specificity: ['baseball', 'softball'], instructions: 'Tee work, soft toss, live pitching practice' },
      { name: 'Shooting Drills', category: 'skill', muscle_groups: ['arms', 'coordination'], equipment_needed: ['basketball', 'hoop'], difficulty_level: 'beginner', sport_specificity: ['basketball'], instructions: 'Form shooting, spot shooting, game-speed shooting' },
      { name: 'Passing Drills', category: 'skill', muscle_groups: ['arms', 'core'], equipment_needed: ['soccer ball'], difficulty_level: 'beginner', sport_specificity: ['soccer'], instructions: 'Short passes, long passes, one-touch passing' }
    ];

    const { data, error } = await supabase
      .from('exercises')
      .insert(exercises);

    if (error) {
      console.error('Error inserting exercises:', error.message);
      return;
    }

    console.log(`✅ Successfully added ${exercises.length} exercises to the database!`);

    // Enable RLS
    console.log('\nEnabling Row Level Security...');
    // Note: This would need to be done via SQL in the dashboard
    console.log('⚠️  RLS policies need to be set up via the Supabase Dashboard SQL editor.');
    console.log('   Copy this SQL and run it in the dashboard:');
    console.log(`
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by all authenticated users"
  ON exercises
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
`);

    console.log('\n✅ Exercise setup complete!');
    console.log('✅ Your AI training plan generation should now work!');
    console.log('\nNext steps:');
    console.log('1. Go back to your app');
    console.log('2. Click "Build My Plan" to create your personalized training plan');
    console.log('3. The AI will now have exercises to choose from!\n');

  } catch (error) {
    console.error('Error setting up exercises:', error);
  }
}

// Run the setup
setupExercisesTable();