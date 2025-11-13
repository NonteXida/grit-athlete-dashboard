import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { AthleteProfile } from './components/AthleteProfile';
import { TrainingHub } from './components/TrainingHub';
import { NutritionModule } from './components/NutritionModule';
import { MediaCenter } from './components/MediaCenter';
import { GoalTracking } from './components/GoalTracking';
import { AuthPage } from './components/AuthPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import type { OnboardingData } from './components/onboarding/OnboardingWizard';

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
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/profile/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data.profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
        return;
      }

      if (data.session) {
        setUser(data.user);
        setAccessToken(data.session.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  }

  async function handleSignup(formData: any) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data);
        alert('Signup failed: ' + (data.error || 'Unknown error'));
        return;
      }

      // After successful signup, log the user in
      await handleLogin(formData.email, formData.password);
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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/onboarding/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(data)
        }
      );

      if (response.ok) {
        console.log('Onboarding complete!');
        // Navigate back to dashboard
        setCurrentPage('dashboard');
        // Refresh user data to reflect new plan
        await fetchUserProfile();
      } else {
        console.error('Failed to complete onboarding:', await response.text());
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !userData) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
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
              <TrainingHub onSaveWorkout={handleSaveWorkout} />
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
