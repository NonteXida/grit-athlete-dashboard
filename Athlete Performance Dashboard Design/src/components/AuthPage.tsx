import React, { useState } from 'react';
import { Trophy, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (userData: any) => void;
}

export function AuthPage({ onLogin, onSignup }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    school: '',
    sport: '',
    gradYear: '',
    userType: 'athlete'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      onSignup(formData);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759787851041-0d45d2b2db84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHRyYWluaW5nJTIwZ3ltfGVufDF8fHx8MTc2MjQzNDAyMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Athletic training"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-12 h-12 text-[#03fd1c]" />
            <span className="text-white text-3xl">AthleteHub</span>
          </div>
          <h1 className="text-white mb-4">Your Journey to Greatness Starts Here</h1>
          <p className="text-gray-300 text-xl mb-8">
            Track your training, showcase your highlights, and achieve your athletic dreams.
          </p>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#03fd1c] rounded-full" />
              <span>Professional athlete profile & highlight reel</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#03fd1c] rounded-full" />
              <span>Advanced training & nutrition tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#03fd1c] rounded-full" />
              <span>Goal setting with coach feedback</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#03fd1c] rounded-full" />
              <span>Character & academic achievement showcase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Trophy className="w-10 h-10 text-[#03fd1c]" />
            <span className="text-white text-2xl">AthleteHub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Profile'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to continue your journey' 
                : 'Join thousands of athletes reaching their potential'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-gray-400 block mb-2">I am a...</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['athlete', 'coach', 'parent'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: type })}
                        className={`
                          px-4 py-3 rounded-lg capitalize transition-all
                          ${formData.userType === type 
                            ? 'bg-[#03fd1c] text-black' 
                            : 'bg-[#141414] text-gray-400 border border-[#252525] hover:border-[#03fd1c]'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#141414] border border-[#252525] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                </div>

                {formData.userType === 'athlete' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 block mb-2">Sport</label>
                        <input
                          type="text"
                          value={formData.sport}
                          onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                          className="w-full bg-[#141414] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                          placeholder="Football"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-2">Grad Year</label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            value={formData.gradYear}
                            onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                            className="w-full bg-[#141414] border border-[#252525] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                            placeholder="2025"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-2">School</label>
                      <input
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        className="w-full bg-[#141414] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                        placeholder="Lincoln High School"
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="text-gray-400 block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#141414] border border-[#252525] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                  placeholder="athlete@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#141414] border border-[#252525] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button variant="primary" className="w-full" type="submit">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-[#03fd1c] transition-all"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          {!isLogin && (
            <div className="mt-8 p-4 bg-[#03fd1c]/10 border border-[#03fd1c]/30 rounded-lg">
              <p className="text-gray-300 text-sm">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
                Athletes under 18 require parent/guardian consent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
