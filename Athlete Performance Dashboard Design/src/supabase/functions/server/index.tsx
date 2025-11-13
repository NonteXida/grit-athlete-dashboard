import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ========== AUTH ROUTES ==========

app.post('/make-server-eec32171/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, school, sport, gradYear, userType } = body;

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional profile data in KV store
    const userId = authData.user.id;
    const profileData = {
      userId,
      email,
      name,
      userType,
      school: school || '',
      sport: sport || '',
      gradYear: gradYear || '',
      bio: '',
      gpa: 0,
      createdAt: new Date().toISOString()
    };

    await kv.set(`profile:${userId}`, profileData);

    // Initialize empty data structures for athlete
    if (userType === 'athlete') {
      await kv.set(`workouts:${userId}`, []);
      await kv.set(`nutrition:${userId}`, []);
      await kv.set(`goals:${userId}`, []);
      await kv.set(`media:${userId}`, []);
    }

    return c.json({ 
      success: true, 
      user: { id: userId, email, name, userType } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ========== PROFILE ROUTES ==========

app.get('/make-server-eec32171/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put('/make-server-eec32171/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const existingProfile = await kv.get(`profile:${user.id}`);
    
    const updatedProfile = {
      ...existingProfile,
      ...body,
      userId: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ========== WORKOUT ROUTES ==========

app.get('/make-server-eec32171/workouts', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const workouts = await kv.get(`workouts:${user.id}`) || [];
    return c.json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return c.json({ error: 'Failed to fetch workouts' }, 500);
  }
});

app.post('/make-server-eec32171/workouts', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const workouts = await kv.get(`workouts:${user.id}`) || [];
    
    const newWorkout = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...body,
      createdAt: new Date().toISOString()
    };

    workouts.push(newWorkout);
    await kv.set(`workouts:${user.id}`, workouts);

    return c.json({ success: true, workout: newWorkout });
  } catch (error) {
    console.error('Error creating workout:', error);
    return c.json({ error: 'Failed to create workout' }, 500);
  }
});

// ========== NUTRITION ROUTES ==========

app.get('/make-server-eec32171/nutrition', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nutrition = await kv.get(`nutrition:${user.id}`) || [];
    return c.json({ nutrition });
  } catch (error) {
    console.error('Error fetching nutrition:', error);
    return c.json({ error: 'Failed to fetch nutrition' }, 500);
  }
});

app.post('/make-server-eec32171/nutrition', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const nutrition = await kv.get(`nutrition:${user.id}`) || [];
    
    const newEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...body,
      createdAt: new Date().toISOString()
    };

    nutrition.push(newEntry);
    await kv.set(`nutrition:${user.id}`, nutrition);

    return c.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error('Error creating nutrition entry:', error);
    return c.json({ error: 'Failed to create nutrition entry' }, 500);
  }
});

// ========== GOAL ROUTES ==========

app.get('/make-server-eec32171/goals', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goals = await kv.get(`goals:${user.id}`) || [];
    return c.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return c.json({ error: 'Failed to fetch goals' }, 500);
  }
});

app.post('/make-server-eec32171/goals', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const goals = await kv.get(`goals:${user.id}`) || [];
    
    const newGoal = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...body,
      progress: 0,
      createdAt: new Date().toISOString()
    };

    goals.push(newGoal);
    await kv.set(`goals:${user.id}`, goals);

    return c.json({ success: true, goal: newGoal });
  } catch (error) {
    console.error('Error creating goal:', error);
    return c.json({ error: 'Failed to create goal' }, 500);
  }
});

app.put('/make-server-eec32171/goals/:goalId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goalId = c.req.param('goalId');
    const body = await c.req.json();
    const goals = await kv.get(`goals:${user.id}`) || [];
    
    const goalIndex = goals.findIndex((g: any) => g.id === goalId);
    if (goalIndex === -1) {
      return c.json({ error: 'Goal not found' }, 404);
    }

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`goals:${user.id}`, goals);

    return c.json({ success: true, goal: goals[goalIndex] });
  } catch (error) {
    console.error('Error updating goal:', error);
    return c.json({ error: 'Failed to update goal' }, 500);
  }
});

// ========== MEDIA ROUTES ==========

app.get('/make-server-eec32171/media', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const media = await kv.get(`media:${user.id}`) || [];
    return c.json({ media });
  } catch (error) {
    console.error('Error fetching media:', error);
    return c.json({ error: 'Failed to fetch media' }, 500);
  }
});

app.post('/make-server-eec32171/media', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const media = await kv.get(`media:${user.id}`) || [];
    
    const newMedia = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...body,
      views: 0,
      createdAt: new Date().toISOString()
    };

    media.push(newMedia);
    await kv.set(`media:${user.id}`, media);

    return c.json({ success: true, media: newMedia });
  } catch (error) {
    console.error('Error uploading media:', error);
    return c.json({ error: 'Failed to upload media' }, 500);
  }
});

// ========== STATS ROUTES ==========

app.get('/make-server-eec32171/stats', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Fetch all user data
    const workouts = await kv.get(`workouts:${user.id}`) || [];
    const goals = await kv.get(`goals:${user.id}`) || [];
    const media = await kv.get(`media:${user.id}`) || [];
    const nutrition = await kv.get(`nutrition:${user.id}`) || [];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate Days Trained This Week
    const recentWorkouts = workouts.filter((w: any) => 
      new Date(w.createdAt) >= oneWeekAgo
    );
    const uniqueDays = new Set(
      recentWorkouts.map((w: any) => 
        new Date(w.createdAt).toDateString()
      )
    );
    const daysTrainedThisWeek = uniqueDays.size;

    // Calculate Current Streak
    let currentStreak = 0;
    const sortedWorkouts = [...workouts].sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (sortedWorkouts.length > 0) {
      const workoutDays = sortedWorkouts.map((w: any) => 
        new Date(w.createdAt).toDateString()
      );
      const uniqueWorkoutDays = [...new Set(workoutDays)];
      
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < uniqueWorkoutDays.length; i++) {
        const workoutDate = new Date(uniqueWorkoutDays[i]);
        workoutDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === currentStreak) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate Profile Views (sum of all media views)
    const totalViews = media.reduce((sum: number, m: any) => sum + (m.views || 0), 0);

    // Calculate Grit Score (0-100 based on consistency and completion)
    let gritScore = 0;
    
    // Workout consistency (40 points max)
    const workoutConsistency = Math.min((daysTrainedThisWeek / 5) * 40, 40);
    gritScore += workoutConsistency;
    
    // Streak bonus (30 points max)
    const streakBonus = Math.min(currentStreak * 2, 30);
    gritScore += streakBonus;
    
    // Goal completion (30 points max)
    const completedGoals = goals.filter((g: any) => g.progress >= 100).length;
    const goalCompletion = goals.length > 0 ? (completedGoals / goals.length) * 30 : 0;
    gritScore += goalCompletion;
    
    gritScore = Math.round(gritScore);

    // Calculate previous week stats for trends
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const previousWeekWorkouts = workouts.filter((w: any) => {
      const workoutDate = new Date(w.createdAt);
      return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo;
    });
    const previousWeekDays = new Set(
      previousWeekWorkouts.map((w: any) => new Date(w.createdAt).toDateString())
    ).size;

    const daysTrend = previousWeekDays > 0 
      ? Math.round(((daysTrainedThisWeek - previousWeekDays) / previousWeekDays) * 100)
      : daysTrainedThisWeek > 0 ? 100 : 0;

    return c.json({
      stats: {
        daysTrainedThisWeek: {
          value: daysTrainedThisWeek,
          trend: {
            value: Math.abs(daysTrend),
            isPositive: daysTrend >= 0
          }
        },
        currentStreak: {
          value: `${currentStreak} Day${currentStreak !== 1 ? 's' : ''}`,
          trend: {
            value: currentStreak > 0 ? 20 : 0,
            isPositive: currentStreak > 0
          }
        },
        profileViews: {
          value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(),
          trend: {
            value: media.length > 0 ? 15 : 0,
            isPositive: true
          }
        },
        gritScore: {
          value: gritScore,
          trend: {
            value: gritScore > 50 ? 8 : 0,
            isPositive: gritScore > 50
          }
        }
      }
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return c.json({ error: 'Failed to calculate stats' }, 500);
  }
});

// ========== WEEKLY GOALS ROUTES ==========

app.get('/make-server-eec32171/weekly-goals', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Fetch user data
    const workouts = await kv.get(`workouts:${user.id}`) || [];
    const nutrition = await kv.get(`nutrition:${user.id}`) || [];
    const goals = await kv.get(`goals:${user.id}`) || [];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate Workouts Goal (target: 5 workouts per week)
    const recentWorkouts = workouts.filter((w: any) => 
      new Date(w.createdAt) >= oneWeekAgo
    );
    const workoutCount = recentWorkouts.length;
    const workoutTarget = 5;
    const workoutProgress = Math.min(Math.round((workoutCount / workoutTarget) * 100), 100);

    // Calculate Nutrition Goal (target: 7 days of nutrition logging)
    const recentNutrition = nutrition.filter((n: any) => 
      new Date(n.createdAt) >= oneWeekAgo
    );
    // Count unique days with nutrition logs
    const nutritionDays = new Set(
      recentNutrition.map((n: any) => 
        new Date(n.createdAt).toDateString()
      )
    );
    const nutritionCount = nutritionDays.size;
    const nutritionTarget = 7;
    const nutritionProgress = Math.min(Math.round((nutritionCount / nutritionTarget) * 100), 100);

    // Calculate Recovery Goal (target: 3 rest days or recovery activities per week)
    // Recovery is defined as days without workouts
    const workoutDays = new Set(
      recentWorkouts.map((w: any) => 
        new Date(w.createdAt).toDateString()
      )
    );
    const recoveryDays = 7 - workoutDays.size;
    const recoveryTarget = 3;
    const recoveryCount = Math.min(recoveryDays, recoveryTarget);
    const recoveryProgress = Math.min(Math.round((recoveryCount / recoveryTarget) * 100), 100);

    const weeklyGoals = [
      { 
        label: 'Workouts', 
        progress: workoutProgress, 
        value: `${workoutCount}/${workoutTarget}` 
      },
      { 
        label: 'Nutrition', 
        progress: nutritionProgress, 
        value: `${nutritionCount}/${nutritionTarget}` 
      },
      { 
        label: 'Recovery', 
        progress: recoveryProgress, 
        value: `${recoveryCount}/${recoveryTarget}` 
      },
    ];

    return c.json({ goals: weeklyGoals });
  } catch (error) {
    console.error('Error calculating weekly goals:', error);
    return c.json({ error: 'Failed to calculate weekly goals' }, 500);
  }
});

// ========== GRIT PLAN / ONBOARDING ROUTES ==========

app.post('/make-server-eec32171/onboarding/complete', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { sport, position, level, goals } = body;

    // Get existing profile
    const existingProfile = await kv.get(`profile:${user.id}`) || {};

    // Update athlete profile with enhanced data
    const enhancedProfile = {
      ...existingProfile,
      sportDetails: {
        sport,
        position,
        level
      },
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${user.id}`, enhancedProfile);

    // Store GRIT goals (enhanced multi-category goals)
    await kv.set(`grit_goals:${user.id}`, goals);

    // Create placeholder for GRIT plan (will be generated with AI later)
    const gritPlan = {
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      currentPhase: 'pre-season',
      goals,
      status: 'pending' // Will be 'active' after plan generation
    };

    await kv.set(`grit_plan:${user.id}`, gritPlan);

    return c.json({ success: true, plan: gritPlan });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return c.json({ error: 'Failed to complete onboarding' }, 500);
  }
});

app.get('/make-server-eec32171/plan/check', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const plan = await kv.get(`grit_plan:${user.id}`);
    return c.json({ hasPlan: !!plan });
  } catch (error) {
    console.error('Error checking for GRIT plan:', error);
    return c.json({ error: 'Failed to check plan' }, 500);
  }
});

app.get('/make-server-eec32171/plan', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const plan = await kv.get(`grit_plan:${user.id}`);
    if (!plan) {
      return c.json({ error: 'No plan found' }, 404);
    }

    return c.json({ plan });
  } catch (error) {
    console.error('Error fetching GRIT plan:', error);
    return c.json({ error: 'Failed to fetch plan' }, 500);
  }
});

// Health check
app.get('/make-server-eec32171/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
