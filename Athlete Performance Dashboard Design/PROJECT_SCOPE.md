# GRIT Athlete Dashboard - Complete Project Scope

## Executive Summary
A comprehensive athlete performance platform combining AI-powered training plan generation with holistic athlete development tracking. The platform serves athletes, coaches, and parents with personalized, position-specific training programs.

---

## 1. CURRENT STATE ASSESSMENT

### Completed Components (60% Done)
- ✅ Full authentication system (Supabase Auth)
- ✅ Complete UI/UX for all major features
- ✅ 8-step onboarding wizard with data collection
- ✅ Dashboard with mock data display
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Navigation and page routing
- ✅ Basic profile management

### Missing Components (40% Remaining)
- ❌ Backend data persistence
- ❌ AI plan generation integration
- ❌ Real workout/nutrition logging
- ❌ Media upload functionality
- ❌ Grit Score calculation
- ❌ Achievement system
- ❌ Coach/Parent dashboards

---

## 2. ONBOARDING AUDIT - MISSING VITAL QUESTIONS

Based on research, the current onboarding is missing critical data points:

### Current Data Collected
✓ Sport, Position, Level
✓ Goals (categories and priorities)
✓ Body type, Height, Weight
✓ Injuries (basic list)
✓ Equipment access
✓ Training schedule
✓ Experience level
✓ Mental profile

### MISSING VITAL DATA (Must Add)

#### Demographics & Medical
- **Age/Date of Birth** - Critical for youth/elderly adaptations
- **Gender** - Affects training recommendations
- **Medical conditions** (asthma, diabetes, heart conditions)
- **Medications** - May affect training response
- **Pregnancy status** - Safety critical
- **Emergency contact** - Liability requirement

#### Performance Baselines
- **Current fitness metrics** (push-ups, pull-ups, mile time)
- **Previous max lifts** (if experienced)
- **Recent training history** (last 4 weeks)
- **Sleep average** (hours per night)
- **Stress level** (1-10 scale)

#### Nutrition & Recovery
- **Dietary restrictions/allergies**
- **Current nutrition approach** (tracking/intuitive/specific diet)
- **Hydration habits**
- **Recovery tools available** (foam roller, massage gun, etc.)

#### Sport-Specific
- **Season phase** (off-season, pre-season, in-season, post-season)
- **Competition dates** (next 12 weeks)
- **Team training schedule** (to avoid conflicts)
- **Coach requirements** (if applicable)

---

## 3. AI PLAN GENERATION ARCHITECTURE

### Recommended Approach (Based on Research)

#### LLM Selection
**Primary:** Claude 3.5 Sonnet ($3/1M input, $15/1M output)
- Best cost/quality balance (~$0.022/plan)
- Safety-focused responses ideal for fitness
- Strong JSON output compliance

**Fallback:** GPT-4 Turbo for complex cases
**Budget:** Claude 3 Haiku for high-volume templates

#### Implementation Architecture
```
Frontend → Supabase Edge Function → Claude API → Validation → Database
                                         ↓
                                   Template Fallback
```

#### Prompt Engineering Strategy
```typescript
const MASTER_PROMPT = `
You are an NSCA-certified strength coach with 15+ years experience.
Generate a ${duration}-week training plan for:

ATHLETE PROFILE:
- Demographics: ${age}, ${gender}, ${weight}kg, ${height}cm
- Sport/Position: ${sport} - ${position} (${level})
- Experience: ${trainingYears} years, ${currentWorkload}
- Goals: ${goals.map(g => g.category).join(', ')}
- Equipment: ${equipment.join(', ')}
- Injuries/Limitations: ${injuries.join(', ')}
- Available Days: ${trainingDays.join(', ')}
- Session Duration: ${sessionDuration} minutes

REQUIREMENTS:
1. Follow periodization principles
2. Include position-specific drills
3. Progressive overload each week
4. Consider injury limitations
5. Balance all fitness components

OUTPUT FORMAT: Return ONLY valid JSON matching this schema:
{schema}
`;
```

#### Cost Optimization
- Cache similar athlete profiles (Redis/Supabase)
- Use templates for 80% of plans, AI for customization
- Batch generation during off-peak hours
- Estimated costs: 100 users/day = $66/month

---

## 4. DATABASE SCHEMA (COMPLETE)

```sql
-- Core Tables for Supabase

-- 1. Extended Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  -- Demographics
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),

  -- Physical
  height_cm NUMERIC,
  weight_kg NUMERIC,
  body_type TEXT,

  -- Sport Info
  sport TEXT NOT NULL,
  position TEXT NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  training_years INT,

  -- Medical
  medical_conditions JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  injuries JSONB DEFAULT '[]',
  is_pregnant BOOLEAN DEFAULT FALSE,

  -- Training Preferences
  equipment_available JSONB DEFAULT '[]',
  training_days JSONB DEFAULT '[]',
  preferred_time TEXT,
  session_duration_minutes INT,

  -- Performance Baselines
  fitness_metrics JSONB DEFAULT '{}',

  -- Meta
  onboarding_completed BOOLEAN DEFAULT FALSE,
  grit_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exercise Library
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'strength', 'cardio', 'skill', 'mobility'
  muscle_groups JSONB,
  equipment_needed JSONB,
  difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
  video_url TEXT,
  instructions TEXT,
  contraindications JSONB,
  position_specific_for JSONB -- ['quarterback', 'point_guard']
);

-- 3. Training Plans
CREATE TABLE training_plans (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  duration_weeks INT NOT NULL,
  start_date DATE,
  end_date DATE,
  plan_type TEXT, -- 'strength', 'skill', 'hybrid'
  ai_generated BOOLEAN DEFAULT TRUE,
  ai_model TEXT,
  prompt_version INT,
  plan_data JSONB NOT NULL, -- Complete plan structure
  status TEXT DEFAULT 'active', -- 'draft', 'active', 'completed', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workout Logs
CREATE TABLE workout_logs (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  plan_id INT REFERENCES training_plans(id),
  workout_date DATE NOT NULL,
  exercises_completed JSONB,
  duration_minutes INT,
  rpe INT CHECK (rpe BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Nutrition Logs
CREATE TABLE nutrition_logs (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  log_date DATE NOT NULL,
  meals JSONB, -- Array of meal objects
  total_calories INT,
  total_protein_g NUMERIC,
  total_carbs_g NUMERIC,
  total_fat_g NUMERIC,
  water_ml INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Goals
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  target_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. Media
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  views INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Achievements
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
```

---

## 5. DEVELOPMENT ROADMAP

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Set up core infrastructure

Tasks:
- [ ] Create all database tables in Supabase
- [ ] Populate exercise library (200+ exercises)
- [ ] Set up Supabase Edge Functions
- [ ] Configure Claude API integration
- [ ] Add missing onboarding questions
- [ ] Implement data validation schemas

### Phase 2: AI Integration (Weeks 3-4)
**Goal:** Generate first AI plans

Tasks:
- [ ] Build plan generation Edge Function
- [ ] Create prompt templates for each sport/position
- [ ] Implement validation and safety checks
- [ ] Add fallback template system
- [ ] Test with 10 athlete profiles
- [ ] Set up caching for cost optimization

### Phase 3: Data Persistence (Weeks 5-6)
**Goal:** Connect frontend to real backend

Tasks:
- [ ] Replace mock data with API calls
- [ ] Implement workout logging
- [ ] Add nutrition tracking
- [ ] Create goal management system
- [ ] Build media upload to Supabase Storage
- [ ] Calculate real Grit Scores

### Phase 4: Advanced Features (Weeks 7-8)
**Goal:** Complete MVP features

Tasks:
- [ ] Achievement system with unlocking logic
- [ ] Progress analytics and charts
- [ ] Plan modification workflows
- [ ] Export features (PDF, calendar)
- [ ] Email notifications
- [ ] Basic coach dashboard

### Phase 5: Testing & Launch (Weeks 9-10)
**Goal:** Production ready

Tasks:
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Legal disclaimers
- [ ] Beta user testing
- [ ] Production deployment

---

## 6. TECHNICAL IMPLEMENTATION DETAILS

### API Endpoints (Supabase Edge Functions)
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/profile/{userId}
PUT    /api/profile/{userId}

POST   /api/onboarding/complete
POST   /api/plans/generate
GET    /api/plans/{planId}
PUT    /api/plans/{planId}

POST   /api/workouts/log
GET    /api/workouts/history
POST   /api/nutrition/log
GET    /api/nutrition/history

POST   /api/goals/create
PUT    /api/goals/{goalId}
GET    /api/goals/list

POST   /api/media/upload
GET    /api/media/gallery

GET    /api/stats/dashboard
GET    /api/stats/grit-score
```

### Plan Generation Pipeline
```typescript
async function generatePlan(athleteData: AthleteProfile) {
  // 1. Validate input data
  const validated = await validateAthleteData(athleteData);

  // 2. Check cache for similar profile
  const cached = await checkCache(validated);
  if (cached) return cached;

  // 3. Build prompt from template
  const prompt = buildPrompt(validated);

  // 4. Call Claude API
  const aiResponse = await callClaude(prompt);

  // 5. Validate AI output
  const plan = await validatePlan(aiResponse);

  // 6. Safety checks
  await performSafetyChecks(plan, validated);

  // 7. Store in database
  await storePlan(plan);

  // 8. Cache for future
  await cachePlan(validated, plan);

  return plan;
}
```

---

## 7. UNIQUE VALUE PROPOSITIONS

### What Sets GRIT Apart
1. **True Position Specificity** - Not just "football training" but "quarterback vs linebacker training"
2. **AI + Human Hybrid** - AI generates, coaches can review/modify
3. **Holistic Development** - Skills + Strength + Nutrition + Mental + Recovery
4. **Progressive Disclosure** - Start simple, unlock advanced features
5. **Multi-Stakeholder** - Athletes, coaches, and parents all have tailored views

### Competitive Advantages
- Lower cost than personal trainers ($20/month vs $200+/month)
- More personalized than generic apps
- Position-specific unlike competitors
- Integrated ecosystem (training + nutrition + tracking)
- Social proof through public profiles

---

## 8. RISK MITIGATION

### Technical Risks
- **AI Hallucination:** Validate all generated plans against exercise database
- **API Downtime:** Template fallback system
- **Cost Overrun:** Caching and rate limiting
- **Data Loss:** Regular backups, soft deletes

### Legal/Safety Risks
- **Injury Liability:** Clear disclaimers, medical clearance requirements
- **Youth Athletes:** Parental consent, age-appropriate programming
- **Medical Conditions:** Screening questionnaire, flag high-risk users
- **Privacy:** GDPR/CCPA compliance, data encryption

---

## 9. SUCCESS METRICS

### Launch Targets (First 3 Months)
- 1,000 registered athletes
- 500 generated training plans
- 70% week-1 retention
- 40% month-1 retention
- 4.5+ App Store rating
- <$0.50 CAC (Customer Acquisition Cost)
- $15 average MRR per user

### Key Performance Indicators
- Plans generated per day
- Workout completion rate
- User engagement (sessions/week)
- Grit Score improvements
- Feature adoption rates
- Support ticket volume

---

## 10. NEXT IMMEDIATE ACTIONS

### Today (30 minutes remaining)
1. ✅ Add "Coming Soon" banners to incomplete features
2. ✅ Update onboarding with missing vital questions
3. ✅ Create basic database schema
4. ✅ Test Claude API connection
5. ✅ Generate first test plan

### This Week
1. Complete database setup
2. Build plan generation function
3. Connect frontend to real data
4. Test with 5 real users
5. Document API endpoints

### This Month
1. Complete MVP features
2. Beta test with 50 users
3. Iterate based on feedback
4. Prepare for launch
5. Set up monitoring/analytics

---

## CONCLUSION

The GRIT Athlete Dashboard is 60% complete with excellent UI/UX already built. The remaining 40% focuses on backend integration, AI plan generation, and data persistence. With the research completed and architecture defined, the project can be completed in 8-10 weeks with a clear path to MVP launch.

**Estimated Total Investment:**
- Development: 200-250 hours
- AI API Costs: $100-200/month initially
- Infrastructure: $50-100/month (Supabase, hosting)
- Marketing: $500-1000 launch budget

**Expected ROI:**
- Break-even: 100 paying users
- Target Year 1: 1,000 users = $15,000 MRR
- Potential exit valuation: 3-5x annual revenue