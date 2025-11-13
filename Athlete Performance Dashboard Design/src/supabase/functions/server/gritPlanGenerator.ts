// GRIT Plan Generation Algorithm
// This module takes onboarding data and generates a personalized training plan

interface WorkoutSession {
  id: string;
  day: string;
  type: string;
  name: string;
  duration: number;
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
  focusAreas: string[];
  intensity: 'low' | 'moderate' | 'high' | 'max';
  notes?: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  weight?: string;
  tempo?: string;
  notes?: string;
}

interface WeeklyPlan {
  week: number;
  phase: string;
  focus: string;
  sessions: WorkoutSession[];
  volumeMinutes: number;
  intensityScore: number;
}

interface GritPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  phase: string;
  goals: any[];
  weeks: WeeklyPlan[];
  progressionStrategy: string;
  adaptationRules: string[];
}

export class GritPlanGenerator {
  private onboardingData: any;
  
  constructor(data: any) {
    this.onboardingData = data;
  }

  generatePlan(): GritPlan {
    // Analyze athlete profile
    const athleteProfile = this.analyzeAthlete();
    
    // Determine training phase and periodization
    const periodization = this.determinePeriodization();
    
    // Generate weekly structure
    const weeks = this.generateWeeks(periodization);
    
    // Create the complete plan
    const plan: GritPlan = {
      id: `grit-plan-${Date.now()}`,
      userId: this.onboardingData.userId,
      name: `${this.onboardingData.sport} GRIT Plan - ${periodization.phase}`,
      startDate: new Date().toISOString(),
      endDate: this.calculateEndDate(periodization.duration),
      phase: periodization.phase,
      goals: this.onboardingData.goals,
      weeks,
      progressionStrategy: periodization.strategy,
      adaptationRules: this.getAdaptationRules()
    };
    
    return plan;
  }

  private analyzeAthlete() {
    const { 
      trainingExperience, 
      currentWorkload, 
      confidenceLevel, 
      focusLevel, 
      trainingReadiness,
      strengths,
      weaknesses
    } = this.onboardingData;

    // Calculate training capacity
    const experienceScore = this.getExperienceScore(trainingExperience);
    const workloadCapacity = this.getWorkloadCapacity(currentWorkload);
    const mentalReadiness = (confidenceLevel + focusLevel + trainingReadiness) / 3;

    return {
      level: experienceScore,
      capacity: workloadCapacity,
      mentalScore: mentalReadiness,
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      readinessScore: Math.round((experienceScore + workloadCapacity + mentalReadiness) / 3)
    };
  }

  private getExperienceScore(experience: string): number {
    const scores: any = {
      beginner: 3,
      intermediate: 5,
      advanced: 7,
      elite: 9
    };
    return scores[experience] || 5;
  }

  private getWorkloadCapacity(workload: string): number {
    const capacity: any = {
      light: 8,
      moderate: 6,
      heavy: 4,
      overwhelming: 2
    };
    return capacity[workload] || 5;
  }

  private determinePeriodization() {
    const { competitionSchedule, goals } = this.onboardingData;
    const timeline = goals?.[0]?.timeline || '3-months';
    
    // Map timeline to weeks
    const durationWeeks: any = {
      '6-weeks': 6,
      '3-months': 12,
      '6-months': 24,
      '12-months': 52
    };

    // Determine phase-specific approach
    const phaseStrategy: any = {
      'pre-season': {
        phase: 'Pre-Season Foundation',
        strategy: 'Progressive overload with strength and conditioning focus',
        blocks: ['Foundation', 'Strength', 'Power', 'Sport-Specific']
      },
      'in-season': {
        phase: 'In-Season Maintenance',
        strategy: 'Maintain fitness while managing fatigue',
        blocks: ['Maintenance', 'Recovery', 'Peak', 'Taper']
      },
      'post-season': {
        phase: 'Post-Season Recovery',
        strategy: 'Active recovery with skill development',
        blocks: ['Recovery', 'Skill Focus', 'Foundation', 'Preparation']
      },
      'off-season': {
        phase: 'Off-Season Development',
        strategy: 'Build strength and address weaknesses',
        blocks: ['Hypertrophy', 'Strength', 'Power', 'Conditioning']
      }
    };

    const strategy = phaseStrategy[competitionSchedule] || phaseStrategy['off-season'];
    
    return {
      phase: strategy.phase,
      strategy: strategy.strategy,
      blocks: strategy.blocks,
      duration: durationWeeks[timeline] || 12
    };
  }

  private generateWeeks(periodization: any): WeeklyPlan[] {
    const weeks: WeeklyPlan[] = [];
    const { trainingDays, sessionDuration, preferredTime } = this.onboardingData;
    const totalWeeks = periodization.duration;
    const blocksPerPhase = Math.ceil(totalWeeks / periodization.blocks.length);

    for (let week = 1; week <= totalWeeks; week++) {
      const blockIndex = Math.floor((week - 1) / blocksPerPhase);
      const currentBlock = periodization.blocks[Math.min(blockIndex, periodization.blocks.length - 1)];
      const weekInBlock = ((week - 1) % blocksPerPhase) + 1;
      
      // Calculate progressive intensity
      const intensityProgression = this.calculateIntensity(week, totalWeeks, weekInBlock, blocksPerPhase);
      
      // Generate sessions for this week
      const sessions = this.generateWeekSessions(
        week,
        currentBlock,
        trainingDays,
        sessionDuration,
        intensityProgression
      );

      weeks.push({
        week,
        phase: currentBlock,
        focus: this.getWeekFocus(currentBlock, weekInBlock),
        sessions,
        volumeMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
        intensityScore: intensityProgression
      });
    }

    return weeks;
  }

  private calculateIntensity(week: number, totalWeeks: number, weekInBlock: number, blocksPerPhase: number): number {
    // Wave loading pattern: build for 3 weeks, deload on 4th
    const isDeloadWeek = weekInBlock % 4 === 0;
    
    if (isDeloadWeek) {
      return 5; // Reduced intensity for recovery
    }

    // Progressive overload within blocks
    const baseIntensity = 6;
    const weekProgression = (weekInBlock - 1) * 0.5;
    const phaseProgression = (week / totalWeeks) * 2;
    
    return Math.min(10, baseIntensity + weekProgression + phaseProgression);
  }

  private generateWeekSessions(
    week: number, 
    block: string, 
    trainingDays: string[], 
    duration: number,
    intensity: number
  ): WorkoutSession[] {
    const sessions: WorkoutSession[] = [];
    const { sport, position, equipmentAccess } = this.onboardingData;
    
    // Map days to session types based on sport and block
    const sessionTypes = this.getSessionTypes(block, sport);
    
    trainingDays.forEach((day, index) => {
      const sessionType = sessionTypes[index % sessionTypes.length];
      const exercises = this.generateExercises(sessionType, block, sport, position, equipmentAccess);
      
      sessions.push({
        id: `session-w${week}-d${index + 1}`,
        day,
        type: sessionType.type,
        name: sessionType.name,
        duration,
        warmup: exercises.warmup,
        main: exercises.main,
        cooldown: exercises.cooldown,
        focusAreas: sessionType.focusAreas,
        intensity: this.mapIntensityLevel(intensity),
        notes: sessionType.notes
      });
    });

    return sessions;
  }

  private getSessionTypes(block: string, sport: string) {
    // Sport-specific session templates
    const templates: any = {
      'Foundation': [
        { type: 'strength', name: 'Total Body Strength', focusAreas: ['strength', 'stability'], notes: 'Focus on form and control' },
        { type: 'conditioning', name: 'Aerobic Base', focusAreas: ['endurance', 'recovery'], notes: 'Maintain conversation pace' },
        { type: 'skill', name: 'Technical Skills', focusAreas: ['technique', 'coordination'], notes: 'Quality over quantity' }
      ],
      'Strength': [
        { type: 'strength', name: 'Upper Body Power', focusAreas: ['chest', 'back', 'shoulders'], notes: 'Heavy loads, low reps' },
        { type: 'strength', name: 'Lower Body Power', focusAreas: ['legs', 'glutes', 'core'], notes: 'Explosive movements' },
        { type: 'conditioning', name: 'Speed & Agility', focusAreas: ['speed', 'agility', 'reaction'], notes: 'Maximum effort, full recovery' }
      ],
      'Power': [
        { type: 'power', name: 'Explosive Training', focusAreas: ['plyometrics', 'olympic lifts'], notes: 'Focus on speed of movement' },
        { type: 'speed', name: 'Sprint Training', focusAreas: ['acceleration', 'max velocity'], notes: 'Full recovery between sets' },
        { type: 'skill', name: 'Sport-Specific Drills', focusAreas: ['game situations', 'decision making'], notes: 'Simulate competition intensity' }
      ],
      'Sport-Specific': [
        { type: 'sport', name: `${sport} Practice`, focusAreas: ['skills', 'tactics', 'game-play'], notes: 'Integration of all components' },
        { type: 'conditioning', name: 'Game Simulation', focusAreas: ['endurance', 'repeated efforts'], notes: 'Match game demands' },
        { type: 'recovery', name: 'Active Recovery', focusAreas: ['mobility', 'flexibility'], notes: 'Low intensity movement' }
      ]
    };

    return templates[block] || templates['Foundation'];
  }

  private generateExercises(sessionType: any, block: string, sport: string, position: string, equipment: string[]) {
    // Generate appropriate exercises based on available equipment and goals
    const hasGym = equipment.includes('full-gym') || equipment.includes('school-gym');
    const hasHome = equipment.includes('home-gym');
    const bodyweightOnly = equipment.includes('bodyweight');

    // Warmup is consistent
    const warmup: Exercise[] = [
      { name: 'Dynamic Stretching', sets: 1, reps: '5 min', rest: 0 },
      { name: 'Sport-Specific Movement', sets: 2, reps: '10 reps', rest: 30 }
    ];

    // Cooldown is consistent
    const cooldown: Exercise[] = [
      { name: 'Static Stretching', sets: 1, reps: '5 min', rest: 0 },
      { name: 'Foam Rolling', sets: 1, reps: '5 min', rest: 0 }
    ];

    // Main exercises based on session type and equipment
    let main: Exercise[] = [];

    if (sessionType.type === 'strength') {
      if (hasGym) {
        main = this.getGymStrengthExercises(sessionType.focusAreas);
      } else if (hasHome) {
        main = this.getHomeStrengthExercises(sessionType.focusAreas);
      } else {
        main = this.getBodyweightExercises(sessionType.focusAreas);
      }
    } else if (sessionType.type === 'conditioning') {
      main = this.getConditioningExercises(sport, position);
    } else if (sessionType.type === 'skill') {
      main = this.getSkillExercises(sport, position);
    } else if (sessionType.type === 'power') {
      main = this.getPowerExercises(hasGym);
    } else if (sessionType.type === 'speed') {
      main = this.getSpeedExercises();
    } else if (sessionType.type === 'recovery') {
      main = this.getRecoveryExercises();
    }

    return { warmup, main, cooldown };
  }

  private getGymStrengthExercises(focusAreas: string[]): Exercise[] {
    const exercises: any = {
      'chest': [
        { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: 120, weight: '75-85% 1RM' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: 90, weight: '70-80% 1RM' }
      ],
      'back': [
        { name: 'Deadlift', sets: 4, reps: '5-6', rest: 180, weight: '80-90% 1RM' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: 90, weight: 'Bodyweight+' }
      ],
      'legs': [
        { name: 'Back Squat', sets: 4, reps: '6-8', rest: 150, weight: '75-85% 1RM' },
        { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: 90, weight: '70-80% 1RM' }
      ],
      'shoulders': [
        { name: 'Military Press', sets: 4, reps: '6-8', rest: 120, weight: '75-85% 1RM' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: 60, weight: 'Light' }
      ],
      'core': [
        { name: 'Plank Variations', sets: 3, reps: '45-60s', rest: 60 },
        { name: 'Pallof Press', sets: 3, reps: '12-15', rest: 60, weight: 'Moderate' }
      ]
    };

    let result: Exercise[] = [];
    focusAreas.forEach(area => {
      if (exercises[area]) {
        result = result.concat(exercises[area]);
      }
    });

    return result.length > 0 ? result : exercises['chest'].concat(exercises['legs']);
  }

  private getHomeStrengthExercises(focusAreas: string[]): Exercise[] {
    return [
      { name: 'Dumbbell Goblet Squat', sets: 4, reps: '10-12', rest: 90, weight: 'Moderate' },
      { name: 'Dumbbell Row', sets: 3, reps: '10-12', rest: 75, weight: 'Moderate' },
      { name: 'Dumbbell Press', sets: 3, reps: '10-12', rest: 75, weight: 'Moderate' },
      { name: 'Dumbbell Lunges', sets: 3, reps: '10 each', rest: 60, weight: 'Light-Moderate' },
      { name: 'Core Circuit', sets: 3, reps: '30s each', rest: 60 }
    ];
  }

  private getBodyweightExercises(focusAreas: string[]): Exercise[] {
    return [
      { name: 'Push-up Variations', sets: 4, reps: '10-20', rest: 60 },
      { name: 'Bodyweight Squats', sets: 4, reps: '15-25', rest: 60 },
      { name: 'Pull-ups/Inverted Rows', sets: 3, reps: 'Max', rest: 90 },
      { name: 'Lunges', sets: 3, reps: '12 each', rest: 60 },
      { name: 'Plank Circuit', sets: 3, reps: '30-45s', rest: 45 },
      { name: 'Burpees', sets: 3, reps: '10-15', rest: 75 }
    ];
  }

  private getConditioningExercises(sport: string, position: string): Exercise[] {
    const sportSpecific: any = {
      'Football': [
        { name: 'Sprint Intervals', sets: 8, reps: '40 yards', rest: 90, notes: '90-95% effort' },
        { name: 'Cone Drills', sets: 4, reps: '30s', rest: 60, notes: 'Focus on change of direction' },
        { name: 'Position Drills', sets: 3, reps: '2 min', rest: 120, notes: 'Game-speed movements' }
      ],
      'Basketball': [
        { name: 'Suicide Runs', sets: 5, reps: '1 set', rest: 120, notes: 'Court sprints' },
        { name: 'Defensive Slides', sets: 4, reps: '30s', rest: 45, notes: 'Stay low' },
        { name: 'Jump Rope', sets: 3, reps: '2 min', rest: 60, notes: 'Varied patterns' }
      ],
      'Soccer': [
        { name: 'Tempo Runs', sets: 4, reps: '400m', rest: 90, notes: '70-80% effort' },
        { name: 'Ball Work Intervals', sets: 6, reps: '1 min', rest: 30, notes: 'High intensity with ball' },
        { name: 'Small-Sided Games', sets: 3, reps: '5 min', rest: 120, notes: 'Game simulation' }
      ],
      'default': [
        { name: 'Interval Running', sets: 6, reps: '2 min', rest: 90, notes: 'Moderate-high intensity' },
        { name: 'Agility Ladder', sets: 4, reps: '30s', rest: 45, notes: 'Quick feet' },
        { name: 'Medicine Ball Circuits', sets: 3, reps: '10 reps', rest: 60, notes: 'Full body movements' }
      ]
    };

    return sportSpecific[sport] || sportSpecific['default'];
  }

  private getSkillExercises(sport: string, position: string): Exercise[] {
    return [
      { name: `${sport} Technical Drills`, sets: 4, reps: '5 min', rest: 60, notes: 'Focus on precision' },
      { name: 'Position-Specific Work', sets: 3, reps: '10 min', rest: 120, notes: `${position} fundamentals` },
      { name: 'Decision Making Drills', sets: 3, reps: '5 min', rest: 90, notes: 'React to cues' },
      { name: 'Film Study/Visualization', sets: 1, reps: '15 min', rest: 0, notes: 'Mental reps' }
    ];
  }

  private getPowerExercises(hasGym: boolean): Exercise[] {
    if (hasGym) {
      return [
        { name: 'Power Clean', sets: 5, reps: '3-5', rest: 180, weight: '70-80% 1RM', notes: 'Explosive' },
        { name: 'Box Jumps', sets: 4, reps: '5-8', rest: 120, notes: 'Maximum height' },
        { name: 'Medicine Ball Slams', sets: 4, reps: '8-10', rest: 90, notes: 'Full power' },
        { name: 'Kettlebell Swings', sets: 3, reps: '15-20', rest: 75, weight: 'Moderate' }
      ];
    } else {
      return [
        { name: 'Jump Squats', sets: 4, reps: '8-10', rest: 90, notes: 'Explosive up' },
        { name: 'Plyo Push-ups', sets: 3, reps: '8-10', rest: 90, notes: 'Explosive push' },
        { name: 'Broad Jumps', sets: 4, reps: '5', rest: 120, notes: 'Maximum distance' },
        { name: 'Single-Leg Bounds', sets: 3, reps: '10 each', rest: 75, notes: 'Control landing' }
      ];
    }
  }

  private getSpeedExercises(): Exercise[] {
    return [
      { name: 'Acceleration Sprints', sets: 6, reps: '20 yards', rest: 120, notes: '100% effort' },
      { name: 'Flying Sprints', sets: 4, reps: '30 yards', rest: 180, notes: 'Build up, max velocity' },
      { name: 'Resisted Sprints', sets: 3, reps: '20 yards', rest: 120, notes: 'Band or sled if available' },
      { name: 'Change of Direction', sets: 4, reps: '10 yards', rest: 90, notes: 'Quick cuts' },
      { name: 'Reaction Starts', sets: 5, reps: '10 yards', rest: 60, notes: 'Various positions' }
    ];
  }

  private getRecoveryExercises(): Exercise[] {
    return [
      { name: 'Yoga Flow', sets: 1, reps: '20 min', rest: 0, notes: 'Focus on breathing' },
      { name: 'Foam Rolling', sets: 1, reps: '15 min', rest: 0, notes: 'Full body' },
      { name: 'Light Swimming/Bike', sets: 1, reps: '20 min', rest: 0, notes: 'Easy pace' },
      { name: 'Mobility Circuit', sets: 2, reps: '10 min', rest: 60, notes: 'Dynamic stretching' },
      { name: 'Breathing Exercises', sets: 1, reps: '10 min', rest: 0, notes: 'Relaxation' }
    ];
  }

  private mapIntensityLevel(intensity: number): 'low' | 'moderate' | 'high' | 'max' {
    if (intensity <= 3) return 'low';
    if (intensity <= 6) return 'moderate';
    if (intensity <= 8) return 'high';
    return 'max';
  }

  private getWeekFocus(block: string, weekInBlock: number): string {
    const focusMap: any = {
      'Foundation': [
        'Movement Quality & Base Building',
        'Progressive Volume Increase',
        'Technique Refinement',
        'Recovery & Adaptation'
      ],
      'Strength': [
        'Maximal Strength Development',
        'Power Output Increase',
        'Neural Adaptation',
        'Deload & Recovery'
      ],
      'Power': [
        'Explosive Movement Training',
        'Rate of Force Development',
        'Sport-Specific Power',
        'Competition Preparation'
      ],
      'Sport-Specific': [
        'Skill Integration',
        'Game Simulation',
        'Peak Performance',
        'Taper & Ready'
      ]
    };

    const focuses = focusMap[block] || focusMap['Foundation'];
    return focuses[Math.min(weekInBlock - 1, focuses.length - 1)];
  }

  private calculateEndDate(weeks: number): string {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (weeks * 7));
    return endDate.toISOString();
  }

  private getAdaptationRules(): string[] {
    const { injuries, recoveryPriority, currentWorkload } = this.onboardingData;
    const rules: string[] = [];

    // Injury accommodations
    if (injuries && injuries.length > 0) {
      rules.push('Modify exercises to avoid aggravating injury areas');
      rules.push('Include extra mobility work for affected areas');
    }

    // Recovery focus
    if (recoveryPriority === 'high') {
      rules.push('Include additional recovery days if fatigue is high');
      rules.push('Monitor sleep and stress levels closely');
    }

    // Workload management
    if (currentWorkload === 'heavy' || currentWorkload === 'overwhelming') {
      rules.push('Start with reduced volume and build gradually');
      rules.push('Prioritize quality over quantity');
    }

    // General rules
    rules.push('Adjust intensity based on daily readiness scores');
    rules.push('Replace exercises if equipment is unavailable');
    rules.push('Modify rest periods based on recovery between sets');

    return rules;
  }
}

// Export function to generate plan from onboarding data
export function generateGritPlan(onboardingData: any): GritPlan {
  const generator = new GritPlanGenerator(onboardingData);
  return generator.generatePlan();
}
