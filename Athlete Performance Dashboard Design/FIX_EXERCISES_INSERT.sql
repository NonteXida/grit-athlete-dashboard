-- Check if exercises table has data first
-- If empty, insert sample exercises

-- Insert sample exercises for various sports
-- Note: Using the correct column names for the existing table structure
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, instructions) VALUES
-- Strength exercises
('Barbell Squat', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell', 'squat rack'], 'intermediate', 'Position the barbell on your upper back, descend by bending knees and hips, then drive up through heels'),
('Bench Press', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', 'Lower the bar to chest level with control, then press up to full extension'),
('Deadlift', 'strength', ARRAY['hamstrings', 'glutes', 'lower back'], ARRAY['barbell'], 'intermediate', 'Hinge at hips, grip bar, drive through heels while maintaining neutral spine'),
('Power Clean', 'strength', ARRAY['full body'], ARRAY['barbell'], 'advanced', 'Explosive pull from floor, catch in front rack position'),
('Pull-ups', 'strength', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', 'Hang from bar, pull body up until chin clears bar'),
('Push-ups', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['none'], 'beginner', 'Maintain plank position, lower chest to floor, push back up'),
('Dumbbell Lunges', 'strength', ARRAY['quadriceps', 'glutes'], ARRAY['dumbbells'], 'beginner', 'Step forward, lower back knee toward ground, drive through front heel to return'),
('Plank', 'strength', ARRAY['core'], ARRAY['none'], 'beginner', 'Hold push-up position on forearms, maintain straight line from head to heels'),
('Romanian Deadlift', 'strength', ARRAY['hamstrings', 'glutes'], ARRAY['barbell'], 'intermediate', 'Hip hinge movement focusing on hamstring stretch'),
('Overhead Press', 'strength', ARRAY['shoulders', 'triceps'], ARRAY['barbell'], 'intermediate', 'Press bar overhead from shoulder level'),
('Dumbbell Row', 'strength', ARRAY['back', 'biceps'], ARRAY['dumbbells'], 'beginner', 'Row weight to hip while maintaining neutral spine'),
('Front Squat', 'strength', ARRAY['quadriceps', 'core'], ARRAY['barbell'], 'advanced', 'Squat with barbell in front rack position'),
('Hip Thrust', 'strength', ARRAY['glutes', 'hamstrings'], ARRAY['barbell', 'bench'], 'intermediate', 'Drive hips upward while shoulders rest on bench'),

-- Cardio exercises
('Sprint Intervals', 'cardio', ARRAY['full body'], ARRAY['track or field'], 'intermediate', 'Sprint at 90-95% effort for specified distance, recover, repeat'),
('Shuttle Runs', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['cones'], 'intermediate', 'Sprint to cone, touch ground, sprint back, repeat'),
('Bike Intervals', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['stationary bike'], 'beginner', 'Alternate between high intensity and recovery periods'),
('Rowing Machine', 'cardio', ARRAY['full body'], ARRAY['rowing machine'], 'intermediate', 'Drive with legs, lean back, pull with arms, return in reverse order'),
('Jump Rope', 'cardio', ARRAY['calves', 'cardiovascular'], ARRAY['jump rope'], 'beginner', 'Jump with both feet, land softly, maintain rhythm'),
('Hill Sprints', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['hill or incline'], 'advanced', 'Sprint uphill at maximum effort'),
('Swimming Laps', 'cardio', ARRAY['full body'], ARRAY['pool'], 'intermediate', 'Continuous swimming with proper stroke technique'),
('Assault Bike', 'cardio', ARRAY['full body'], ARRAY['assault bike'], 'advanced', 'High-intensity intervals using arms and legs'),

-- Plyometric exercises
('Box Jumps', 'plyometric', ARRAY['legs', 'glutes'], ARRAY['plyometric box'], 'intermediate', 'Jump explosively onto box, step down, repeat'),
('Medicine Ball Slams', 'plyometric', ARRAY['core', 'shoulders'], ARRAY['medicine ball'], 'intermediate', 'Raise ball overhead, slam down with force, catch and repeat'),
('Depth Jumps', 'plyometric', ARRAY['legs'], ARRAY['plyometric box'], 'advanced', 'Step off box, land and immediately jump vertically'),
('Broad Jumps', 'plyometric', ARRAY['legs', 'glutes'], ARRAY['none'], 'intermediate', 'Jump forward as far as possible, land softly'),
('Burpees', 'plyometric', ARRAY['full body'], ARRAY['none'], 'intermediate', 'Squat, jump back to plank, push-up, jump feet to hands, jump up'),
('Jump Squats', 'plyometric', ARRAY['legs', 'glutes'], ARRAY['none'], 'beginner', 'Squat down and explode upward into a jump'),
('Clap Push-ups', 'plyometric', ARRAY['chest', 'triceps'], ARRAY['none'], 'advanced', 'Explosive push-up with clap at the top'),
('Single Leg Bounds', 'plyometric', ARRAY['legs'], ARRAY['none'], 'intermediate', 'Bound forward on one leg for distance'),
('Tuck Jumps', 'plyometric', ARRAY['legs', 'core'], ARRAY['none'], 'intermediate', 'Jump and bring knees to chest'),

-- Agility exercises
('Ladder Drills', 'agility', ARRAY['legs', 'coordination'], ARRAY['agility ladder'], 'beginner', 'Various footwork patterns through ladder rungs'),
('Cone Drills', 'agility', ARRAY['legs', 'coordination'], ARRAY['cones'], 'beginner', 'Change direction quickly around cone pattern'),
('T-Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', 'Sprint forward, shuffle laterally, backpedal in T pattern'),
('5-10-5 Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', 'Sprint 5 yards, change direction, sprint 10 yards, change direction, sprint 5 yards'),
('L-Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', 'Sprint, cut at 90 degrees in L pattern'),
('Box Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', 'Sprint, shuffle, backpedal, shuffle in square pattern'),
('Figure 8 Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'beginner', 'Run figure 8 pattern around cones'),
('Zig-Zag Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'beginner', 'Sprint in zig-zag pattern through cones'),

-- Flexibility exercises
('Dynamic Warm-up', 'flexibility', ARRAY['full body'], ARRAY['none'], 'beginner', 'Leg swings, arm circles, walking lunges, high knees'),
('Static Stretching', 'flexibility', ARRAY['full body'], ARRAY['none'], 'beginner', 'Hold stretches for 20-30 seconds per muscle group'),
('Foam Rolling', 'flexibility', ARRAY['full body'], ARRAY['foam roller'], 'beginner', 'Roll slowly over muscle groups to release tension'),
('Yoga Flow', 'flexibility', ARRAY['full body'], ARRAY['yoga mat'], 'intermediate', 'Series of yoga poses for flexibility and balance'),
('PNF Stretching', 'flexibility', ARRAY['targeted muscles'], ARRAY['partner or band'], 'advanced', 'Contract-relax stretching technique'),
('Dynamic Leg Swings', 'flexibility', ARRAY['hips', 'legs'], ARRAY['none'], 'beginner', 'Controlled leg swings in multiple directions'),
('Shoulder Dislocations', 'flexibility', ARRAY['shoulders'], ARRAY['resistance band'], 'intermediate', 'Rotate shoulders with band for mobility'),

-- Core exercises
('Russian Twists', 'core', ARRAY['obliques', 'abs'], ARRAY['medicine ball'], 'intermediate', 'Rotate torso side to side with weight'),
('Bicycle Crunches', 'core', ARRAY['abs', 'obliques'], ARRAY['none'], 'beginner', 'Alternating elbow to opposite knee'),
('Dead Bug', 'core', ARRAY['abs'], ARRAY['none'], 'beginner', 'Opposite arm and leg extensions while lying'),
('Pallof Press', 'core', ARRAY['core'], ARRAY['cable or band'], 'intermediate', 'Anti-rotation exercise with cable resistance'),
('Hanging Knee Raises', 'core', ARRAY['abs', 'hip flexors'], ARRAY['pull-up bar'], 'intermediate', 'Hang from bar and raise knees to chest'),
('Ab Wheel Rollout', 'core', ARRAY['abs'], ARRAY['ab wheel'], 'advanced', 'Roll wheel forward and back maintaining core tension'),
('Bird Dog', 'core', ARRAY['core', 'back'], ARRAY['none'], 'beginner', 'Opposite arm and leg raise from quadruped position'),

-- Olympic lifts
('Snatch', 'olympic', ARRAY['full body'], ARRAY['barbell'], 'advanced', 'Explosive lift from floor to overhead in one motion'),
('Clean and Jerk', 'olympic', ARRAY['full body'], ARRAY['barbell'], 'advanced', 'Clean to shoulders, then jerk overhead'),
('Hang Clean', 'olympic', ARRAY['full body'], ARRAY['barbell'], 'intermediate', 'Clean from hang position above knees'),
('Push Jerk', 'olympic', ARRAY['shoulders', 'legs'], ARRAY['barbell'], 'intermediate', 'Drive bar overhead with leg assistance'),

-- Sport-specific skill work
('Quarterback Drops', 'skill', ARRAY['legs', 'coordination'], ARRAY['none'], 'intermediate', '3-step, 5-step, and 7-step drops with proper footwork'),
('Dribbling Drills', 'skill', ARRAY['coordination'], ARRAY['basketball'], 'beginner', 'Crossovers, between legs, behind back dribbling patterns'),
('Batting Practice', 'skill', ARRAY['core', 'arms'], ARRAY['bat', 'balls'], 'intermediate', 'Tee work, soft toss, live pitching practice'),
('Shooting Drills', 'skill', ARRAY['arms', 'coordination'], ARRAY['basketball', 'hoop'], 'beginner', 'Form shooting, spot shooting, game-speed shooting'),
('Passing Drills', 'skill', ARRAY['arms', 'core'], ARRAY['soccer ball'], 'beginner', 'Short passes, long passes, one-touch passing'),
('Route Running', 'skill', ARRAY['legs', 'coordination'], ARRAY['cones'], 'intermediate', 'Practice precise route patterns for football'),
('Defensive Slides', 'skill', ARRAY['legs'], ARRAY['none'], 'beginner', 'Lateral defensive movement for basketball'),
('Tackling Drills', 'skill', ARRAY['full body'], ARRAY['tackling dummy'], 'intermediate', 'Proper form tackling technique'),

-- Recovery exercises
('Light Jog', 'recovery', ARRAY['legs'], ARRAY['none'], 'beginner', 'Easy pace jogging for active recovery'),
('Walking', 'recovery', ARRAY['full body'], ARRAY['none'], 'beginner', 'Low-intensity walking for recovery'),
('Swimming Easy', 'recovery', ARRAY['full body'], ARRAY['pool'], 'beginner', 'Light swimming for active recovery'),
('Mobility Work', 'recovery', ARRAY['full body'], ARRAY['none'], 'beginner', 'Joint circles and gentle movement patterns');