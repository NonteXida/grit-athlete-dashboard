import React, { useState, useEffect } from 'react';
import { Camera, MapPin, GraduationCap, Award, Heart, Star, Upload, User, Ruler, Weight, Calendar, Target, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase, profileHelpers } from '../lib/supabase';

interface AthleteProfileProps {
  userData: any;
  onUpdate: (data: any) => void;
}

export function AthleteProfile({ userData, onUpdate }: AthleteProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFullProfile();
  }, [userData?.id]);

  async function fetchFullProfile() {
    if (!userData?.id) return;

    try {
      setLoading(true);
      const profileData = await profileHelpers.getProfile(userData.id);
      if (profileData) {
        setProfile(profileData);
        console.log('Full profile loaded:', profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate age from date_of_birth
  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Convert cm to feet and inches
  const formatHeight = (cm: number) => {
    if (!cm) return 'Not specified';
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  // Convert kg to lbs
  const formatWeight = (kg: number) => {
    if (!kg) return 'Not specified';
    return `${Math.round(kg * 2.20462)} lbs`;
  };

  const achievements = [
    { year: '2024', title: 'All-State First Team', description: 'Selected as one of the top players in the state' },
    { year: '2024', title: 'Team Captain', description: 'Elected by teammates and coaches' },
    { year: '2023', title: 'MVP - Regional Championship', description: '3 TDs, 250 yards rushing' },
    { year: '2023', title: '1000 Yard Club', description: 'Rushed for over 1000 yards in the season' },
  ];

  const characterTraits = [
    { trait: 'Leadership', description: 'Natural leader on and off the field' },
    { trait: 'Work Ethic', description: 'First to arrive, last to leave' },
    { trait: 'Coachability', description: 'Always seeking to improve and learn' },
    { trait: 'Team Player', description: 'Puts team success above individual stats' },
  ];

  const testimonials = [
    {
      name: 'Coach Mike Johnson',
      role: 'Head Coach',
      text: 'One of the most dedicated athletes I\'ve coached in my 20-year career. Natural leader who elevates everyone around them.',
      avatar: null
    },
    {
      name: 'Sarah Mitchell',
      role: 'Strength & Conditioning Coach',
      text: 'Exceptional work ethic in the weight room. Never misses a session and always pushes teammates to be better.',
      avatar: null
    },
  ];

  // Use profile data if available, fallback to userData
  const displayProfile = profile || userData;

  const stats = [
    { label: 'Sport', value: displayProfile?.sport || 'Not specified', icon: Award },
    { label: 'Position', value: displayProfile?.position || 'Not specified', icon: User },
    { label: 'Height', value: formatHeight(displayProfile?.height_cm), icon: Ruler },
    { label: 'Weight', value: formatWeight(displayProfile?.weight_kg), icon: Weight },
    { label: 'Age', value: calculateAge(displayProfile?.date_of_birth) ? `${calculateAge(displayProfile?.date_of_birth)} years` : 'Not specified', icon: Calendar },
    { label: 'Skill Level', value: displayProfile?.skill_level?.charAt(0).toUpperCase() + displayProfile?.skill_level?.slice(1) || 'Not specified', icon: Star },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Cover Photo */}
      <div className="relative h-64 rounded-2xl overflow-hidden group">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1747336406309-79970f9066b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwc2Nob29sJTIwYXRobGV0ZXxlbnwxfHx8fDE3NjI0ODAwODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm">
            <Camera className="w-4 h-4" />
            Change Cover
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative">
        <div className="absolute -top-24 left-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-[#0a0a0a] overflow-hidden bg-[#252525]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBsYXllciUyMGFjdGlvbnxlbnwxfHx8fDE3NjIzODkzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#03fd1c] rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 pt-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="ml-0 md:ml-36">
              <h2 className="text-white mb-2">{displayProfile?.name || userData?.name || userData?.email?.split('@')[0] || 'Athlete'}</h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                {(displayProfile?.school || userData?.school) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{displayProfile?.school || userData?.school}</span>
                  </div>
                )}
                {(displayProfile?.graduation_year || userData?.gradYear) && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Class of {displayProfile?.graduation_year || userData?.gradYear}</span>
                  </div>
                )}
                {(displayProfile?.gpa || userData?.gpa) && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>GPA: {displayProfile?.gpa || userData?.gpa}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant={isEditing ? 'secondary' : 'outline'} 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-white mb-2">About</h4>
            {isEditing ? (
              <textarea
                className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg p-4 text-white resize-none"
                rows={4}
                defaultValue={displayProfile?.bio || userData?.bio || ''}
                placeholder="Tell us about yourself, your athletic journey, and your goals..."
              />
            ) : (
              <p className="text-gray-300">
                {displayProfile?.bio || userData?.bio ||
                  `Dedicated ${displayProfile?.sport || 'athlete'} with a passion for excellence both on the field and in the classroom.`}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-[#0a0a0a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-[#03fd1c]" />
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
                <p className="text-white font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Information */}
      {displayProfile?.primary_goals && displayProfile.primary_goals.length > 0 && (
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-[#03fd1c]" />
            <h3 className="text-white">Training Goals & Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-400 mb-3">Primary Goals</h4>
              <ul className="space-y-2">
                {displayProfile.primary_goals.map((goal: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#03fd1c] mt-0.5" />
                    <span className="text-gray-300">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            {displayProfile?.training_days && displayProfile.training_days.length > 0 && (
              <div>
                <h4 className="text-gray-400 mb-3">Training Schedule</h4>
                <div className="flex flex-wrap gap-2">
                  {displayProfile.training_days.map((day: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-[#0a0a0a] rounded-full text-sm text-gray-300">
                      {day}
                    </span>
                  ))}
                </div>
                {displayProfile?.session_duration_minutes && (
                  <p className="text-gray-400 text-sm mt-3">
                    Session duration: {displayProfile.session_duration_minutes} minutes
                  </p>
                )}
              </div>
            )}
          </div>
          {displayProfile?.equipment_available && displayProfile.equipment_available.length > 0 && (
            <div className="mt-6">
              <h4 className="text-gray-400 mb-3">Available Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {displayProfile.equipment_available.map((item: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-[#0a0a0a] border border-[#252525] rounded-lg text-sm text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Character Traits */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-[#03fd1c]" />
          <h3 className="text-white">Character & Values</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characterTraits.map((item, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#03fd1c]" />
                <p className="text-white">{item.trait}</p>
              </div>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Achievement Timeline</h3>
          {isEditing && (
            <Button variant="ghost" size="sm">
              <Upload className="w-4 h-4" />
              Add Achievement
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#03fd1c]/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#03fd1c]" />
                </div>
                {idx !== achievements.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[#252525] my-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#03fd1c]">{achievement.year}</span>
                  <span className="text-gray-500">•</span>
                  <p className="text-white">{achievement.title}</p>
                </div>
                <p className="text-gray-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <h3 className="text-white mb-6">Coach Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#252525] rounded-full flex items-center justify-center">
                  <span className="text-white">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white">{testimonial.name}</p>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Reel */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Highlight Reel</h3>
          <Button variant="ghost" size="sm">
            <Upload className="w-4 h-4" />
            Upload Video
          </Button>
        </div>
        <div className="aspect-video bg-[#0a0a0a] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Upload your highlight reel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
