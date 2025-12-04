import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { AthleteProfile } from './components/AthleteProfile';
import { EnhancedTrainingHub } from './components/EnhancedTrainingHub';
import { NutritionModule } from './components/NutritionModule';
import { MediaCenter } from './components/MediaCenter';
import { GoalTracking } from './components/GoalTracking';
import { AuthPage } from './components/AuthPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import type { OnboardingData } from './components/onboarding/OnboardingWizard';
import { profileHelpers, type Profile } from './lib/supabase';
import { useAIPlanGeneration } from './hooks/useAIPlanGeneration';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { generatePlan, adjustPlanBasedOnFeedback } = useAIPlanGeneration();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user && accessToken) {
      fetchUserProfile();
    }
  }, [user, accessToken]);

  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProfile() {
    if (!user?.id) {
      console.log('No user ID available for profile fetch');
      return;
    }

    try {
      console.log('Fetching profile for user:', user.id);
      const profile = await profileHelpers.getProfile(user.id);
      console.log('Profile fetch result:', profile);

      if (profile) {
        setUserData(profile);
      } else {
        // Profile doesn't exist yet, create a basic one
        console.log('No profile found, creating new one...');
        const newProfile: Profile = {
          id: user.id,
          date_of_birth: null,
          gender: null,
          sport: null,
          position: null,
          skill_level: 'beginner',
          onboarding_completed: false
        };

        const success = await profileHelpers.createProfile(newProfile);
        console.log('Profile creation result:', success);
        if (success) {
          setUserData(newProfile);
        } else {
          // Even if creation fails, set basic data to prevent loop
          setUserData({
            ...newProfile,
            name: user.email?.split('@')[0] || 'Athlete'
          } as any);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set fallback data to prevent infinite loop
      setUserData({
        id: user.id,
        name: user.email?.split('@')[0] || 'Athlete',
        sport: '',
        position: '',
        skill_level: 'beginner',
        onboarding_completed: false
      } as any);
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      console.log('Attempting login for:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('Session created:', data.session);
        setUser(data.user);
        setAccessToken(data.session.access_token);

        // Set a default userData immediately to navigate away from auth page
        const defaultProfile: Profile = {
          id: data.user.id,
          date_of_birth: null,
          gender: null,
          sport: null,
          position: null,
          skill_level: 'beginner',
          onboarding_completed: false
        };
        setUserData(defaultProfile);

        // Then fetch or create the actual profile
        setTimeout(async () => {
          const profile = await profileHelpers.getProfile(data.user.id);
          console.log('Profile fetched:', profile);

          if (!profile) {
            // Create profile if it doesn't exist
            const success = await profileHelpers.createProfile(defaultProfile);
            if (!success) {
              console.error('Failed to create profile');
            }
          } else {
            setUserData(profile);
          }
          setLoading(false);
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error as any).message);
      setLoading(false);
    }
  }

  async function handleSignup(formData: any) {
    try {
      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          },
          emailRedirectTo: window.location.origin // For email confirmation
        }
      });

      if (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // Email is confirmed, proceed with profile creation
          const newProfile: Profile = {
            id: data.user.id,
            name: formData.name || formData.email.split('@')[0],
            date_of_birth: null,
            gender: null,
            sport: null,
            position: null,
            skill_level: 'beginner',
            onboarding_completed: false
          };

          const profileCreated = await profileHelpers.createProfile(newProfile);
          if (!profileCreated) {
            console.error('Failed to create profile for new user');
          }

          // After successful signup, log the user in
          await handleLogin(formData.email, formData.password);
        } else {
          // Email confirmation required
          alert('Please check your email to confirm your account. You may need to check your spam folder.');

          // For development: Try to sign in anyway (in case email confirmation is disabled)
          // Also save the name to profile for when they do confirm
          setTimeout(async () => {
            try {
              // Try to create profile with name even if not confirmed yet
              const newProfile: Profile = {
                id: data.user.id,
                name: formData.name || formData.email.split('@')[0],
                date_of_birth: null,
                gender: null,
                sport: null,
                position: null,
                skill_level: 'beginner',
                onboarding_completed: false
              };
              await profileHelpers.createProfile(newProfile);

              await handleLogin(formData.email, formData.password);
            } catch (e) {
              console.log('Auto-login attempt failed, email confirmation likely required');
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      setAccessToken(null);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  function handleUpdateProfile(data: any) {
    setUserData({ ...userData, ...data });
    // Would normally call API here
  }

  function handleSaveWorkout(workout: any) {
    console.log('Save workout:', workout);
    // Would normally call API here
  }

  async function handleOnboardingComplete(data: OnboardingData) {
    try {
      // Transform OnboardingData to Profile format
      const profileData: Partial<Profile> = {
        // Demographics
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        emergency_contact: data.emergencyContact,

        // Physical Attributes
        height_cm: data.height ?
          (parseInt(data.height.feet) * 30.48 + parseInt(data.height.inches) * 2.54) : undefined,
        weight_kg: data.weight ? data.weight * 0.453592 : undefined, // Convert lbs to kg
        body_type: data.bodyType,

        // Sport Information
        sport: data.sport || '',
        position: data.position || '',
        skill_level: data.level as any,
        season_phase: data.seasonPhase as any,
        next_competition: data.nextCompetition,
        team_schedule: data.teamSchedule,

        // Medical Information
        medical_conditions: data.medicalConditions || [],
        medications: data.medications ? [data.medications] : [],
        dietary_restrictions: data.dietaryRestrictions,
        is_pregnant: data.isPregnant,
        injuries: data.injuries || [],

        // Training Preferences
        equipment_available: data.equipmentAccess || [],
        training_days: data.trainingDays || [],
        preferred_time: data.preferredTime,
        session_duration_minutes: data.sessionDuration,

        // Performance Baselines
        fitness_metrics: {
          pushUps: data.pushUps,
          pullUps: data.pullUps,
          mileTime: data.mileTime,
          fortyYardDash: data.fortyYardDash,
          verticalJump: data.verticalJump,
          benchPress: data.benchPress,
          beepTest: data.beepTest
        },
        recent_training_frequency: data.recentFrequency,
        recent_training_focus: data.recentFocus,
        sleep_hours: data.sleepHours ? parseFloat(data.sleepHours) : undefined,
        stress_level: data.stressLevel ? parseInt(data.stressLevel) : undefined,
        hydration_glasses: data.hydration ? parseInt(data.hydration) : undefined,
        nutrition_approach: data.nutritionApproach,
        recovery_tools: data.recoveryTools || [],

        // Goals
        primary_goals: data.goals || [],

        // Meta
        onboarding_completed: true,
        grit_score: data.mentalStrengthScore
      };

      // Update the profile in the database
      const success = await profileHelpers.updateProfile(user.id, profileData);

      if (success) {
        console.log('Onboarding complete and profile saved!');

        // Generate initial AI training plan
        try {
          console.log('Generating personalized training plan...');
          console.log('Calling generatePlan with userId:', user.id);

          const plan = await generatePlan(user.id, {
            planType: 'initial',
            includeRecentData: false
          });

          console.log('Training plan generated successfully:', plan);

          // Show success message
          alert('Your personalized GRIT training plan has been created! Check the Training Hub to view it.');
        } catch (planError: any) {
          console.error('Failed to generate training plan:', planError);
          console.error('Error details:', planError.message);

          // Show user-friendly error message
          if (planError.message?.includes('ANTHROPIC_API_KEY')) {
            alert('AI training plan generation is not configured yet. Please contact support or try again later.');
          } else {
            alert('Failed to generate your training plan. You can try rebuilding it from the Training Hub.');
          }
          // Don't block onboarding completion if plan generation fails
        }

        // Navigate back to dashboard
        setCurrentPage('dashboard');
        // Refresh user data to reflect new profile
        await fetchUserProfile();
      } else {
        console.error('Failed to save onboarding data to profile');
        alert('Failed to save your information. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('An error occurred. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show auth page only if no user is logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // If user is logged in but no profile data, use default
  // This prevents infinite loading loops
  if (!userData && user) {
    const defaultData = {
      id: user.id,
      name: user.email?.split('@')[0] || 'Athlete',
      sport: '',
      position: '',
      skill_level: 'beginner',
      onboarding_completed: false
    };

    // Set default data to prevent loop, then try to fetch actual data
    if (!loading) {
      setUserData(defaultData);
      fetchUserProfile();
    }
  }

  // Default user data if not loaded yet
  const displayUserData = userData || {
    name: 'Jordan Martinez',
    sport: 'Football',
    school: 'Lincoln High School',
    gradYear: '2025',
    gpa: 3.6,
    bio: 'Dedicated student-athlete with a passion for football and commitment to excellence both on the field and in the classroom. Team captain focused on leadership, character development, and achieving my dreams of playing at the collegiate level.'
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      {currentPage === 'planBuilder' ? (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete}
          onClose={() => setCurrentPage('dashboard')}
        />
      ) : (
        <main className="flex-1 p-8 lg:pl-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <DashboardHome 
                userData={displayUserData} 
                onNavigate={setCurrentPage}
                accessToken={accessToken || undefined}
              />
            )}
            {currentPage === 'profile' && (
              <AthleteProfile 
                userData={displayUserData}
                onUpdate={handleUpdateProfile}
              />
            )}
            {currentPage === 'training' && (
              <EnhancedTrainingHub userId={user?.id || ''} onNavigate={setCurrentPage} />
            )}
            {currentPage === 'nutrition' && (
              <NutritionModule />
            )}
            {currentPage === 'media' && (
              <MediaCenter />
            )}
            {currentPage === 'goals' && (
              <GoalTracking />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
