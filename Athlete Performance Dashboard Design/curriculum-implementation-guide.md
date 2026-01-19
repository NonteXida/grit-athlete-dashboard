# Training Curriculum Implementation Guide
## Technical Specifications for Athlete Dashboard Integration

---

## OVERVIEW

This document provides the technical blueprint for implementing the comprehensive training curriculum framework in your athlete dashboard application. It includes database schemas, API endpoints, algorithmic logic, and UI/UX specifications.

---

## DATABASE SCHEMA

### Core Tables

#### 1. athletes
```sql
CREATE TABLE athletes (
    athlete_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),

    -- Onboarding data
    sport VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    experience_level VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Advanced, Elite
    training_days_available INTEGER CHECK (training_days_available BETWEEN 1 AND 7),
    session_duration_minutes INTEGER CHECK (session_duration_minutes BETWEEN 30 AND 120),
    current_fitness_level VARCHAR(20),
    injuries_limitations JSONB, -- Flexible field for injury details

    -- Current status
    active_plan_id UUID REFERENCES training_plans(plan_id),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_date TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_athletes_sport_position ON athletes(sport, position);
CREATE INDEX idx_athletes_user_id ON athletes(user_id);
```

#### 2. training_plans
```sql
CREATE TABLE training_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,

    -- Plan configuration
    plan_name VARCHAR(200),
    plan_duration_weeks INTEGER NOT NULL, -- 4, 8, or 12
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    current_week INTEGER DEFAULT 1,

    -- Plan structure (JSON for flexibility)
    weekly_structure JSONB NOT NULL, -- Full week-by-week breakdown
    periodization_model VARCHAR(50), -- Linear, Undulating, Block
    position_category VARCHAR(50), -- Power-Endurance, Explosive-Speed, etc.

    -- Protocols
    nutrition_protocol JSONB,
    recovery_protocol JSONB,
    testing_schedule JSONB,

    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, completed, paused, cancelled
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_training_plans_athlete ON training_plans(athlete_id);
CREATE INDEX idx_training_plans_status ON training_plans(status);
CREATE INDEX idx_training_plans_dates ON training_plans(start_date, end_date);
```

#### 3. training_sessions
```sql
CREATE TABLE training_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES training_plans(plan_id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,

    -- Session details
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    session_date DATE NOT NULL,
    session_name VARCHAR(200),
    session_type VARCHAR(50), -- Skills, Strength, Power, Conditioning, Competition, Recovery

    -- Session structure
    exercises JSONB NOT NULL, -- Array of exercises with sets/reps/notes
    warm_up JSONB,
    cool_down JSONB,

    -- Planning
    estimated_duration_minutes INTEGER,
    session_focus VARCHAR(200),
    coaching_notes TEXT,

    -- Execution tracking
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, skipped
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration_minutes INTEGER,

    -- Post-session data
    athlete_rpe INTEGER CHECK (athlete_rpe BETWEEN 1 AND 10), -- Rate of Perceived Exertion
    athlete_notes TEXT,
    completion_percentage DECIMAL(5,2),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_training_sessions_athlete ON training_sessions(athlete_id);
CREATE INDEX idx_training_sessions_plan ON training_sessions(plan_id);
CREATE INDEX idx_training_sessions_date ON training_sessions(session_date);
CREATE INDEX idx_training_sessions_status ON training_sessions(status);
```

#### 4. exercises_library
```sql
CREATE TABLE exercises_library (
    exercise_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Exercise identification
    exercise_name VARCHAR(200) NOT NULL,
    exercise_code VARCHAR(50) UNIQUE, -- For programmatic reference
    category VARCHAR(50) NOT NULL, -- Skills, Strength, Power, Conditioning, Mobility, Recovery
    subcategory VARCHAR(50), -- Technical, Tactical, Aerobic, etc.

    -- Applicability
    sports TEXT[], -- Array of applicable sports
    positions TEXT[], -- Array of applicable positions
    experience_level_min VARCHAR(20), -- Minimum experience level
    experience_level_max VARCHAR(20), -- Maximum experience level (NULL = all)

    -- Exercise details
    description TEXT NOT NULL,
    coaching_cues TEXT[],
    common_errors TEXT[],
    equipment_required TEXT[],
    space_required VARCHAR(100),

    -- Media
    video_url VARCHAR(500),
    video_thumbnail_url VARCHAR(500),
    diagram_url VARCHAR(500),

    -- Programming defaults
    default_sets INTEGER,
    default_reps INTEGER,
    default_duration_seconds INTEGER,
    default_rest_seconds INTEGER,

    -- Progressions
    progression_from UUID REFERENCES exercises_library(exercise_id), -- Easier version
    progression_to UUID REFERENCES exercises_library(exercise_id), -- Harder version
    alternative_exercises UUID[], -- Array of exercise_ids for substitutions

    -- Metrics
    measurable_metrics TEXT[], -- velocity, height, time, distance, accuracy_pct, etc.

    -- Metadata
    created_by UUID REFERENCES users(user_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_exercises_category ON exercises_library(category);
CREATE INDEX idx_exercises_sports ON exercises_library USING GIN(sports);
CREATE INDEX idx_exercises_positions ON exercises_library USING GIN(positions);
CREATE INDEX idx_exercises_name ON exercises_library(exercise_name);
```

#### 5. exercise_completions
```sql
CREATE TABLE exercise_completions (
    completion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES training_sessions(session_id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises_library(exercise_id),

    -- Planned vs actual
    planned_sets INTEGER,
    planned_reps INTEGER,
    planned_weight DECIMAL(6,2),
    planned_duration_seconds INTEGER,

    actual_sets INTEGER,
    actual_reps INTEGER,
    actual_weight DECIMAL(6,2),
    actual_duration_seconds INTEGER,

    -- Performance metrics
    metrics JSONB, -- Flexible field for exercise-specific metrics

    -- Quality
    form_quality INTEGER CHECK (form_quality BETWEEN 1 AND 5), -- Self-assessment
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),

    -- Notes
    athlete_notes TEXT,
    coach_notes TEXT,

    -- Video
    video_url VARCHAR(500), -- If athlete records themselves

    -- Metadata
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_exercise_completions_athlete ON exercise_completions(athlete_id);
CREATE INDEX idx_exercise_completions_session ON exercise_completions(session_id);
CREATE INDEX idx_exercise_completions_exercise ON exercise_completions(exercise_id);
CREATE INDEX idx_exercise_completions_date ON exercise_completions(completed_at);
```

#### 6. performance_tests
```sql
CREATE TABLE performance_tests (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    plan_id UUID REFERENCES training_plans(plan_id),

    -- Test identification
    test_name VARCHAR(200) NOT NULL,
    test_category VARCHAR(50) NOT NULL, -- Strength, Power, Speed, Skill, Conditioning, Cognitive
    test_date DATE NOT NULL,
    week_number INTEGER, -- Which week of plan

    -- Test results (flexible JSONB for various test types)
    results JSONB NOT NULL,

    -- Common metrics (extracted for easier querying)
    primary_value DECIMAL(10,2), -- Main metric (e.g., 35.5 for vertical jump inches)
    primary_unit VARCHAR(20), -- inches, mph, seconds, percentage, etc.

    -- Comparison
    baseline_value DECIMAL(10,2), -- First test value for comparison
    previous_value DECIMAL(10,2), -- Last test value
    improvement_percentage DECIMAL(6,2),

    -- Context
    conditions TEXT, -- Weather, fatigue level, etc.
    tester_name VARCHAR(100),

    -- Notes
    athlete_notes TEXT,
    coach_notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_performance_tests_athlete ON performance_tests(athlete_id);
CREATE INDEX idx_performance_tests_category ON performance_tests(test_category);
CREATE INDEX idx_performance_tests_date ON performance_tests(test_date);
```

#### 7. nutrition_logs
```sql
CREATE TABLE nutrition_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,

    -- Daily tracking
    log_date DATE NOT NULL,

    -- Macros
    total_calories INTEGER,
    protein_grams DECIMAL(6,2),
    carbs_grams DECIMAL(6,2),
    fat_grams DECIMAL(6,2),

    -- Hydration
    water_ml INTEGER,

    -- Meal timing
    meals JSONB, -- Array of meal objects with time and macros

    -- Supplements
    supplements_taken TEXT[],

    -- Targets (from plan)
    target_calories INTEGER,
    target_protein DECIMAL(6,2),
    target_carbs DECIMAL(6,2),
    target_fat DECIMAL(6,2),

    -- Compliance
    compliance_score DECIMAL(4,2), -- Calculated based on hitting targets

    -- Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(athlete_id, log_date)
);

-- Indexes
CREATE INDEX idx_nutrition_logs_athlete ON nutrition_logs(athlete_id);
CREATE INDEX idx_nutrition_logs_date ON nutrition_logs(log_date);
```

#### 8. recovery_logs
```sql
CREATE TABLE recovery_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,

    -- Daily tracking
    log_date DATE NOT NULL,

    -- Sleep
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    sleep_time TIME, -- Bedtime
    wake_time TIME,

    -- Readiness
    readiness_score INTEGER CHECK (readiness_score BETWEEN 1 AND 10),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
    soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 10),

    -- Soreness locations
    soreness_areas JSONB, -- {"hamstrings": 7, "shoulders": 4}

    -- Recovery activities
    activities_completed TEXT[], -- foam_rolling, ice_bath, massage, etc.

    -- Injuries/pain
    injury_status VARCHAR(50),
    pain_locations JSONB,

    -- Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(athlete_id, log_date)
);

-- Indexes
CREATE INDEX idx_recovery_logs_athlete ON recovery_logs(athlete_id);
CREATE INDEX idx_recovery_logs_date ON recovery_logs(log_date);
```

---

## API ENDPOINTS

### Athlete Onboarding

**POST /api/v1/athletes/onboard**
```json
Request:
{
    "user_id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "date_of_birth": "date",
    "sport": "string",
    "position": "string",
    "experience_level": "Intermediate",
    "training_days_available": 5,
    "session_duration_minutes": 90,
    "current_fitness_level": "Good",
    "injuries_limitations": [
        {
            "type": "patellar_tendinitis",
            "severity": "minor",
            "affected_area": "right_knee",
            "restrictions": ["high_volume_jumping", "heavy_squats"]
        }
    ]
}

Response:
{
    "athlete_id": "uuid",
    "message": "Athlete profile created successfully",
    "next_step": "generate_plan"
}
```

### Plan Generation

**POST /api/v1/training-plans/generate**
```json
Request:
{
    "athlete_id": "uuid",
    "plan_duration_weeks": 8,
    "start_date": "2025-01-15",
    "goals": ["increase_vertical", "improve_ball_handling"],
    "preferences": {
        "emphasis": "skills", // skills, strength, balanced
        "competition_date": "2025-03-20"
    }
}

Response:
{
    "plan_id": "uuid",
    "plan_name": "Point Guard 8-Week Development Plan",
    "start_date": "2025-01-15",
    "end_date": "2025-03-11",
    "weeks": [
        {
            "week_number": 1,
            "phase": "Foundation",
            "focus": "Skill building and base strength",
            "sessions": [
                {
                    "day": 1,
                    "session_name": "Ball Handling + Lower Strength",
                    "session_type": "Skills_Strength",
                    "estimated_duration": 90,
                    "exercises": [...]
                }
            ]
        }
    ],
    "nutrition_protocol": {...},
    "recovery_protocol": {...},
    "testing_schedule": [
        {
            "week": 1,
            "tests": ["baseline_vertical", "baseline_shooting"]
        },
        {
            "week": 4,
            "tests": ["progress_vertical", "progress_shooting"]
        }
    ]
}
```

### Session Management

**GET /api/v1/training-sessions/today**
```json
Query Parameters:
- athlete_id: uuid

Response:
{
    "session_id": "uuid",
    "session_name": "Ball Handling + Lower Strength",
    "session_date": "2025-01-15",
    "week_number": 1,
    "day_number": 1,
    "estimated_duration": 90,
    "status": "scheduled",
    "warm_up": {
        "duration": 10,
        "exercises": [
            {
                "name": "Dynamic stretching",
                "duration_seconds": 300,
                "instructions": "..."
            }
        ]
    },
    "main_work": [
        {
            "block": "Ball Handling",
            "duration": 35,
            "exercises": [
                {
                    "exercise_id": "uuid",
                    "exercise_name": "Stationary Two-Ball Drills",
                    "sets": 4,
                    "reps": null,
                    "duration_seconds": 30,
                    "rest_seconds": 30,
                    "coaching_cues": ["Head up", "Fingertip control"],
                    "video_url": "https://...",
                    "metrics_to_track": ["quality_rating"]
                }
            ]
        }
    ],
    "cool_down": {...}
}
```

**POST /api/v1/training-sessions/:session_id/start**
```json
Request:
{
    "actual_start_time": "2025-01-15T16:00:00Z"
}

Response:
{
    "session_id": "uuid",
    "status": "in_progress",
    "message": "Session started"
}
```

**POST /api/v1/training-sessions/:session_id/complete**
```json
Request:
{
    "actual_end_time": "2025-01-15T17:35:00Z",
    "athlete_rpe": 7,
    "completion_percentage": 95,
    "athlete_notes": "Felt strong today, shooting was on point"
}

Response:
{
    "session_id": "uuid",
    "status": "completed",
    "actual_duration": 95,
    "message": "Session completed successfully",
    "next_session": {
        "session_id": "uuid",
        "session_date": "2025-01-16",
        "session_name": "..."
    }
}
```

### Exercise Logging

**POST /api/v1/exercises/complete**
```json
Request:
{
    "session_id": "uuid",
    "athlete_id": "uuid",
    "exercise_id": "uuid",
    "actual_sets": 4,
    "actual_reps": 8,
    "actual_weight": 185.5,
    "metrics": {
        "velocity_mph": 55.3,
        "accuracy_percentage": 85
    },
    "form_quality": 4,
    "difficulty": 3,
    "athlete_notes": "Felt explosive",
    "video_url": "https://..."
}

Response:
{
    "completion_id": "uuid",
    "message": "Exercise logged successfully",
    "comparison": {
        "previous_weight": 175.0,
        "improvement": "+10.5 lbs"
    }
}
```

### Performance Testing

**POST /api/v1/performance-tests/log**
```json
Request:
{
    "athlete_id": "uuid",
    "plan_id": "uuid",
    "test_name": "Vertical Jump",
    "test_category": "Power",
    "test_date": "2025-01-15",
    "results": {
        "jump_height_inches": 35.5,
        "approach_used": true,
        "attempts": [34.2, 35.5, 35.1]
    },
    "primary_value": 35.5,
    "primary_unit": "inches",
    "conditions": "Indoor facility, fresh legs",
    "athlete_notes": "New PR!"
}

Response:
{
    "test_id": "uuid",
    "message": "Test logged successfully",
    "comparison": {
        "baseline_value": 32.0,
        "previous_value": 34.0,
        "improvement_from_baseline": "+3.5 inches (+10.9%)",
        "improvement_from_previous": "+1.5 inches (+4.4%)"
    },
    "ranking": {
        "percentile_for_position": 75,
        "target_for_elite": 38.0
    }
}
```

**GET /api/v1/performance-tests/history**
```json
Query Parameters:
- athlete_id: uuid
- test_category: Power (optional)
- test_name: Vertical Jump (optional)
- start_date: 2024-01-01 (optional)
- end_date: 2025-01-15 (optional)

Response:
{
    "tests": [
        {
            "test_id": "uuid",
            "test_name": "Vertical Jump",
            "test_date": "2025-01-15",
            "primary_value": 35.5,
            "primary_unit": "inches"
        },
        {
            "test_id": "uuid",
            "test_name": "Vertical Jump",
            "test_date": "2024-12-01",
            "primary_value": 34.0,
            "primary_unit": "inches"
        }
    ],
    "chart_data": {
        "labels": ["2024-12-01", "2025-01-15"],
        "values": [34.0, 35.5],
        "trend": "improving"
    }
}
```

### Nutrition Tracking

**POST /api/v1/nutrition/log**
```json
Request:
{
    "athlete_id": "uuid",
    "log_date": "2025-01-15",
    "total_calories": 3250,
    "protein_grams": 235,
    "carbs_grams": 420,
    "fat_grams": 75,
    "water_ml": 3500,
    "meals": [
        {
            "meal_time": "2025-01-15T08:00:00Z",
            "meal_name": "Breakfast",
            "calories": 650,
            "protein": 45,
            "carbs": 70,
            "fat": 20
        }
    ],
    "supplements_taken": ["creatine_5g", "omega3", "vitamin_d"]
}

Response:
{
    "log_id": "uuid",
    "compliance_score": 96.5,
    "targets": {
        "calories": 3200,
        "protein": 238,
        "carbs": 442,
        "fat": 76
    },
    "variance": {
        "calories": "+50 (+1.6%)",
        "protein": "-3g (-1.3%)",
        "carbs": "-22g (-5.0%)",
        "fat": "-1g (-1.3%)"
    },
    "message": "Excellent nutrition compliance!"
}
```

### Recovery Tracking

**POST /api/v1/recovery/log**
```json
Request:
{
    "athlete_id": "uuid",
    "log_date": "2025-01-15",
    "sleep_hours": 8.5,
    "sleep_quality": 8,
    "sleep_time": "22:30:00",
    "wake_time": "07:00:00",
    "readiness_score": 8,
    "fatigue_level": 3,
    "soreness_level": 4,
    "soreness_areas": {
        "quads": 5,
        "hamstrings": 3,
        "shoulders": 2
    },
    "activities_completed": ["foam_rolling", "ice_bath"],
    "notes": "Legs a bit sore from yesterday's session"
}

Response:
{
    "log_id": "uuid",
    "message": "Recovery logged successfully",
    "recommendations": [
        "Consider extra foam rolling for quads before next session",
        "Sleep quality excellent - maintain current routine"
    ],
    "readiness_trend": "stable",
    "alert": null
}
```

### Progress Analytics

**GET /api/v1/analytics/progress**
```json
Query Parameters:
- athlete_id: uuid
- start_date: 2024-12-01
- end_date: 2025-01-15

Response:
{
    "summary": {
        "sessions_completed": 28,
        "sessions_scheduled": 30,
        "completion_rate": 93.3,
        "total_training_hours": 42.5,
        "avg_session_rpe": 7.2
    },
    "performance_improvements": [
        {
            "metric": "Vertical Jump",
            "baseline": 32.0,
            "current": 35.5,
            "improvement": "+3.5 inches (+10.9%)"
        },
        {
            "metric": "Ball Velocity",
            "baseline": 52.0,
            "current": 55.3,
            "improvement": "+3.3 mph (+6.3%)"
        }
    ],
    "nutrition_compliance": {
        "avg_daily_compliance": 92.4,
        "days_logged": 42,
        "days_in_period": 45
    },
    "recovery_metrics": {
        "avg_sleep_hours": 8.3,
        "avg_readiness": 7.8,
        "avg_soreness": 3.2
    },
    "charts": {
        "performance_trend": [...],
        "volume_by_week": [...],
        "rpe_trend": [...]
    }
}
```

---

## PLAN GENERATION ALGORITHM

### High-Level Flow

```
1. Input: Athlete profile (sport, position, experience, days, duration, fitness, injuries)
2. Determine position category (Power-Endurance, Explosive-Speed, etc.)
3. Select plan duration (4/8/12 weeks)
4. Choose periodization model (Linear for beginners, Undulating for advanced)
5. Generate weekly structure
6. Populate sessions with exercises from library
7. Apply injury modifications
8. Generate nutrition protocol
9. Generate recovery protocol
10. Schedule testing points
11. Output: Complete training plan
```

### Detailed Algorithm

```javascript
function generateTrainingPlan(athleteProfile, planConfig) {
    // Step 1: Categorize position
    const positionCategory = categorizePosition(
        athleteProfile.sport,
        athleteProfile.position
    );

    // Step 2: Determine training split
    const trainingSplit = getTrainingSplit(
        positionCategory,
        athleteProfile.training_days_available
    );

    // Step 3: Select periodization model
    const periodization = selectPeriodization(
        athleteProfile.experience_level,
        planConfig.plan_duration_weeks
    );

    // Step 4: Generate weekly structure
    const weeks = [];
    for (let week = 1; week <= planConfig.plan_duration_weeks; week++) {
        const phase = determinePhase(week, planConfig.plan_duration_weeks, periodization);
        const intensity = calculateIntensity(week, phase, periodization);

        const sessions = generateWeeklySessions(
            athleteProfile,
            trainingSplit,
            phase,
            intensity,
            week
        );

        weeks.push({
            week_number: week,
            phase: phase,
            intensity: intensity,
            sessions: sessions
        });
    }

    // Step 5: Apply injury modifications
    const modifiedWeeks = applyInjuryModifications(
        weeks,
        athleteProfile.injuries_limitations
    );

    // Step 6: Generate protocols
    const nutritionProtocol = generateNutritionProtocol(
        athleteProfile,
        positionCategory
    );

    const recoveryProtocol = generateRecoveryProtocol(
        athleteProfile,
        positionCategory
    );

    const testingSchedule = generateTestingSchedule(
        athleteProfile.sport,
        athleteProfile.position,
        planConfig.plan_duration_weeks
    );

    return {
        plan_name: `${athleteProfile.position} ${planConfig.plan_duration_weeks}-Week ${athleteProfile.experience_level} Plan`,
        plan_duration_weeks: planConfig.plan_duration_weeks,
        start_date: planConfig.start_date,
        end_date: calculateEndDate(planConfig.start_date, planConfig.plan_duration_weeks),
        periodization_model: periodization,
        position_category: positionCategory,
        weekly_structure: modifiedWeeks,
        nutrition_protocol: nutritionProtocol,
        recovery_protocol: recoveryProtocol,
        testing_schedule: testingSchedule
    };
}

function categorizePosition(sport, position) {
    const categoryMap = {
        'Basketball': {
            'Point Guard': 'Power-Endurance',
            'Shooting Guard': 'Power-Endurance',
            'Small Forward': 'Power-Endurance',
            'Power Forward': 'Strength-Power',
            'Center': 'Strength-Power'
        },
        'Football': {
            'Quarterback': 'Explosive-Speed',
            'Running Back': 'Explosive-Speed',
            'Wide Receiver': 'Explosive-Speed',
            'Linebacker': 'Strength-Power',
            'Offensive Line': 'Strength-Power',
            'Defensive Line': 'Strength-Power'
        },
        'Soccer': {
            'Goalkeeper': 'Explosive-Speed',
            'Center Back': 'Power-Endurance',
            'Fullback': 'Power-Endurance',
            'Midfielder': 'Power-Endurance',
            'Winger': 'Explosive-Speed',
            'Striker': 'Explosive-Speed'
        }
        // ... other sports
    };

    return categoryMap[sport]?.[position] || 'Power-Endurance';
}

function getTrainingSplit(positionCategory, daysAvailable) {
    const splits = {
        'Power-Endurance': {
            3: { strength: 1, power: 1, conditioning: 1 },
            4: { strength: 2, power: 1, conditioning: 1 },
            5: { strength: 2, power: 2, conditioning: 1 },
            6: { strength: 2, power: 2, conditioning: 2 },
            7: { strength: 3, power: 2, conditioning: 2 }
        },
        'Explosive-Speed': {
            3: { strength: 1, power: 1, speed: 1 },
            4: { strength: 1, power: 2, speed: 1 },
            5: { strength: 2, power: 2, speed: 1 },
            6: { strength: 2, power: 2, speed: 2 },
            7: { strength: 2, power: 3, speed: 2 }
        },
        'Strength-Power': {
            3: { strength: 2, power: 1, conditioning: 0 },
            4: { strength: 2, power: 1, conditioning: 1 },
            5: { strength: 2, power: 2, conditioning: 1 },
            6: { strength: 3, power: 2, conditioning: 1 },
            7: { strength: 3, power: 2, conditioning: 2 }
        },
        'Endurance-Stability': {
            3: { strength: 1, conditioning: 2 },
            4: { strength: 1, conditioning: 3 },
            5: { strength: 2, conditioning: 3 },
            6: { strength: 2, conditioning: 4 },
            7: { strength: 2, conditioning: 5 }
        }
    };

    return splits[positionCategory][daysAvailable];
}

function selectPeriodization(experienceLevel, planDuration) {
    if (experienceLevel === 'Beginner' || experienceLevel === 'Intermediate') {
        return 'Linear';
    } else if (planDuration === 12) {
        return 'Block';
    } else {
        return 'Undulating';
    }
}

function determinePhase(weekNumber, totalWeeks, periodization) {
    if (periodization === 'Linear') {
        const phaseLength = Math.floor(totalWeeks / 3);
        if (weekNumber <= phaseLength) return 'Foundation';
        if (weekNumber <= phaseLength * 2) return 'Development';
        if (weekNumber < totalWeeks) return 'Peak';
        return 'Deload';
    } else if (periodization === 'Block') {
        if (weekNumber <= 4) return 'Accumulation';
        if (weekNumber <= 8) return 'Intensification';
        if (weekNumber <= 11) return 'Realization';
        return 'Recovery';
    } else {
        // Undulating varies within each week
        return weekNumber === totalWeeks ? 'Deload' : 'Mixed';
    }
}

function calculateIntensity(weekNumber, phase, periodization) {
    const intensityMap = {
        'Foundation': 0.65,
        'Development': 0.75,
        'Peak': 0.90,
        'Deload': 0.60,
        'Accumulation': 0.70,
        'Intensification': 0.85,
        'Realization': 0.95,
        'Recovery': 0.55,
        'Mixed': 0.80
    };

    let baseIntensity = intensityMap[phase];

    // Progressive overload within phase
    if (phase !== 'Deload' && phase !== 'Recovery') {
        baseIntensity += (weekNumber % 4) * 0.05;
    }

    return Math.min(baseIntensity, 1.0);
}

function generateWeeklySessions(athleteProfile, trainingSplit, phase, intensity, weekNumber) {
    const sessions = [];
    let dayCounter = 0;

    // Skills sessions (every training day)
    for (let i = 0; i < athleteProfile.training_days_available; i++) {
        const sessionType = determineSessionType(i, trainingSplit);

        const session = {
            day_number: ++dayCounter,
            session_name: generateSessionName(sessionType, athleteProfile.position),
            session_type: sessionType,
            estimated_duration_minutes: athleteProfile.session_duration_minutes,
            exercises: selectExercises(
                athleteProfile,
                sessionType,
                phase,
                intensity,
                athleteProfile.session_duration_minutes
            ),
            warm_up: generateWarmUp(sessionType),
            cool_down: generateCoolDown(sessionType)
        };

        sessions.push(session);
    }

    return sessions;
}

function selectExercises(athleteProfile, sessionType, phase, intensity, duration) {
    // Query exercises from library
    const candidateExercises = queryExerciseLibrary({
        sport: athleteProfile.sport,
        position: athleteProfile.position,
        experience_level: athleteProfile.experience_level,
        session_type: sessionType,
        phase: phase
    });

    // Time allocation based on session duration
    const timeAllocation = allocateTime(duration, sessionType);

    // Select exercises to fill time blocks
    const selectedExercises = [];

    // Skills block
    const skillExercises = candidateExercises.filter(e => e.category === 'Skills');
    selectedExercises.push(...fillTimeBlock(
        skillExercises,
        timeAllocation.skills,
        intensity
    ));

    // Physical block (strength/power/conditioning based on session type)
    if (sessionType.includes('Strength')) {
        const strengthExercises = candidateExercises.filter(e => e.category === 'Strength');
        selectedExercises.push(...fillTimeBlock(
            strengthExercises,
            timeAllocation.strength,
            intensity
        ));
    }

    if (sessionType.includes('Power')) {
        const powerExercises = candidateExercises.filter(e => e.category === 'Power');
        selectedExercises.push(...fillTimeBlock(
            powerExercises,
            timeAllocation.power,
            intensity
        ));
    }

    // Apply intensity adjustments
    return selectedExercises.map(ex => applyIntensity(ex, intensity));
}

function applyInjuryModifications(weeks, injuries) {
    if (!injuries || injuries.length === 0) return weeks;

    return weeks.map(week => ({
        ...week,
        sessions: week.sessions.map(session => ({
            ...session,
            exercises: session.exercises.filter(exercise => {
                // Remove contraindicated exercises
                return !isContraindicated(exercise, injuries);
            }).map(exercise => {
                // Modify exercises if needed
                return modifyForInjury(exercise, injuries);
            })
        }))
    }));
}

function generateNutritionProtocol(athleteProfile, positionCategory) {
    // Calculate caloric needs
    const bmr = calculateBMR(athleteProfile);
    const activityMultiplier = getActivityMultiplier(positionCategory);
    const targetCalories = Math.round(bmr * activityMultiplier);

    // Determine macro ratios based on phase (would be passed in)
    const phase = 'Development'; // Simplified for example
    const macros = getMacroRatios(phase);

    return {
        daily_calories: targetCalories,
        protein_grams: Math.round((targetCalories * macros.protein_pct) / 4),
        carbs_grams: Math.round((targetCalories * macros.carbs_pct) / 4),
        fat_grams: Math.round((targetCalories * macros.fat_pct) / 9),
        hydration_ml: Math.round(athleteProfile.weight_kg * 35),
        meal_timing: generateMealTiming(athleteProfile.training_days_available),
        supplements: getRecommendedSupplements(positionCategory)
    };
}

function generateRecoveryProtocol(athleteProfile, positionCategory) {
    return {
        sleep_target_hours: athleteProfile.experience_level === 'Elite' ? 9.5 : 8.5,
        daily_activities: [
            'foam_rolling_15min',
            'mobility_work_10min'
        ],
        weekly_activities: [
            {
                activity: 'sports_massage',
                frequency: 'weekly',
                duration_minutes: 60
            }
        ],
        position_specific: getPositionRecovery(positionCategory),
        injury_prevention: getInjuryPreventionProtocols(
            athleteProfile.sport,
            athleteProfile.position
        )
    };
}

function generateTestingSchedule(sport, position, planDuration) {
    const tests = getPositionKPIs(sport, position);

    const schedule = [
        {
            week: 1,
            type: 'baseline',
            tests: tests
        }
    ];

    if (planDuration >= 8) {
        schedule.push({
            week: 4,
            type: 'progress',
            tests: tests
        });
    }

    if (planDuration === 12) {
        schedule.push({
            week: 8,
            type: 'progress',
            tests: tests
        });
    }

    schedule.push({
        week: planDuration,
        type: 'final',
        tests: tests
    });

    return schedule;
}
```

---

## UI/UX COMPONENTS

### 1. Dashboard Homepage

**Layout:**
```
┌─────────────────────────────────────────┐
│  Welcome back, [Name]!                  │
│  [Sport] - [Position]                   │
├─────────────────────────────────────────┤
│  TODAY'S SESSION                        │
│  ┌───────────────────────────────────┐ │
│  │ Ball Handling + Lower Strength    │ │
│  │ 90 minutes • Week 3, Day 2        │ │
│  │ [START SESSION] button            │ │
│  └───────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  WEEKLY PROGRESS                        │
│  ████████░░ 80% (4/5 sessions)         │
├─────────────────────────────────────────┤
│  QUICK STATS                            │
│  ┌─────────┬─────────┬─────────┐      │
│  │ Vertical│ Sleep   │ Nutrition│      │
│  │ 35.5"   │ 8.3 hrs │ 94%      │      │
│  │ +1.5"   │ ▲       │ ▲        │      │
│  └─────────┴─────────┴─────────┘      │
├─────────────────────────────────────────┤
│  UPCOMING                               │
│  • Tomorrow: Speed/Agility + Upper     │
│  • Friday: Testing Day - Vertical Jump │
└─────────────────────────────────────────┘
```

### 2. Session View

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← Back    Ball Handling + Lower       │
│            Week 3, Day 2                │
├─────────────────────────────────────────┤
│  WARM-UP (10 min)                       │
│  ☑ Dynamic stretching (5 min)          │
│  ☑ Arm circles & band work (5 min)     │
├─────────────────────────────────────────┤
│  BALL HANDLING (35 min)                 │
│  ──────────────────────────────────────│
│  1. Stationary Two-Ball Drills         │
│     4 sets × 30 sec each variation     │
│     Rest: 30 sec                        │
│     [▶ Watch video] [✓ Mark complete]  │
│                                         │
│     Coaching cues:                      │
│     • Head up, not watching balls      │
│     • Fingertip control                │
│                                         │
│     ☐ Set 1  ☐ Set 2  ☐ Set 3  ☐ Set 4│
│                                         │
│  2. Live Dribble Moves vs Defense      │
│     [Collapsed - Click to expand]      │
├─────────────────────────────────────────┤
│  LOWER STRENGTH (30 min)                │
│  [Collapsed]                            │
├─────────────────────────────────────────┤
│  COOL-DOWN (5 min)                      │
│  [Collapsed]                            │
├─────────────────────────────────────────┤
│  [FINISH SESSION]                       │
└─────────────────────────────────────────┘
```

### 3. Exercise Detail Modal

**Layout:**
```
┌─────────────────────────────────────────┐
│  Stationary Two-Ball Drills        [×] │
├─────────────────────────────────────────┤
│  [Video Player - Full width]            │
│  ▶ 0:45 / 1:30                         │
├─────────────────────────────────────────┤
│  DESCRIPTION                            │
│  Practice dribbling two basketballs...  │
│                                         │
│  COACHING CUES                          │
│  • Head up, not watching balls         │
│  • Fingertip control, not palms        │
│  • Low athletic stance                 │
│  • Same height on both dribbles        │
│                                         │
│  COMMON ERRORS                          │
│  ✗ Watching the balls instead of up    │
│  ✗ Using palms instead of fingertips   │
│                                         │
│  PROGRESSIONS                           │
│  ← Easier: Single ball dribbling       │
│  → Harder: Two-ball with movement      │
├─────────────────────────────────────────┤
│  LOG YOUR SET                           │
│  Sets completed: [1] [2] [3] [4]       │
│  Quality (1-5): ★★★★☆                  │
│  Difficulty (1-5): ★★★☆☆               │
│  Notes: ________________________        │
│  [SAVE]                                 │
└─────────────────────────────────────────┘
```

### 4. Progress/Analytics Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Progress & Analytics                   │
│  [Last 30 days ▼] [Export PDF]         │
├─────────────────────────────────────────┤
│  PERFORMANCE TESTS                      │
│  ┌───────────────────────────────────┐ │
│  │ Vertical Jump                     │ │
│  │ [Line chart showing improvement]  │ │
│  │ Baseline: 32.0"  Current: 35.5"   │ │
│  │ Improvement: +3.5" (+10.9%)       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Ball Velocity                     │ │
│  │ [Line chart]                      │ │
│  │ Baseline: 52 mph  Current: 55 mph │ │
│  └───────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  TRAINING VOLUME                        │
│  [Bar chart - hours per week]          │
│  Week 1: 6h  Week 2: 7.5h  Week 3: 7h  │
├─────────────────────────────────────────┤
│  NUTRITION COMPLIANCE                   │
│  ████████████████░░ 92.4% avg          │
│  [Mini calendar heatmap - green=good]  │
├─────────────────────────────────────────┤
│  RECOVERY METRICS                       │
│  Avg Sleep: 8.3 hrs                    │
│  Avg Readiness: 7.8/10                 │
│  Avg Soreness: 3.2/10                  │
│  [Trend line charts for each]          │
└─────────────────────────────────────────┘
```

### 5. Nutrition Logging

**Layout:**
```
┌─────────────────────────────────────────┐
│  Nutrition Log - Today                  │
│  [< Previous day] Jan 15 [Next day >]   │
├─────────────────────────────────────────┤
│  DAILY TARGETS                          │
│  ┌─────────────────────────────────┐   │
│  │ Calories:  3250 / 3200          │   │
│  │ ████████████████████░ 102%      │   │
│  │                                 │   │
│  │ Protein:   235g / 238g          │   │
│  │ ████████████████████░ 99%       │   │
│  │                                 │   │
│  │ Carbs:     420g / 442g          │   │
│  │ ██████████████████░░░ 95%       │   │
│  │                                 │   │
│  │ Fat:       75g / 76g            │   │
│  │ ████████████████████░ 99%       │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  MEALS                                  │
│  ┌─────────────────────────────────┐   │
│  │ 🌅 Breakfast - 8:00 AM          │   │
│  │ 650 cal | 45p | 70c | 20f       │   │
│  │ [Edit] [Delete]                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🌤 Snack - 11:00 AM             │   │
│  │ 350 cal | 30p | 40c | 8f        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Add Meal]                           │
├─────────────────────────────────────────┤
│  HYDRATION                              │
│  💧💧💧💧💧💧💧░ 3500ml / 4000ml      │
│  [+ Add 250ml]                          │
├─────────────────────────────────────────┤
│  SUPPLEMENTS                            │
│  ☑ Creatine (5g)                       │
│  ☑ Omega-3                             │
│  ☑ Vitamin D                           │
│  ☐ Collagen + Vit C                    │
└─────────────────────────────────────────┘
```

### 6. Recovery Logging

**Layout:**
```
┌─────────────────────────────────────────┐
│  Recovery Log - Today                   │
│  [< Previous] Jan 15 [Next >]           │
├─────────────────────────────────────────┤
│  SLEEP                                  │
│  Hours: [8.5]                          │
│  Bedtime: [10:30 PM]                   │
│  Wake time: [7:00 AM]                  │
│  Quality (1-10): ★★★★★★★★☆☆ 8         │
├─────────────────────────────────────────┤
│  READINESS                              │
│  Overall readiness (1-10):              │
│  ★★★★★★★★☆☆ 8                          │
│                                         │
│  Fatigue level (1-10):                  │
│  ★★★☆☆☆☆☆☆☆ 3                          │
│                                         │
│  Soreness level (1-10):                 │
│  ★★★★☆☆☆☆☆☆ 4                          │
├─────────────────────────────────────────┤
│  SORENESS AREAS                         │
│  [Body diagram - click to mark]         │
│       👤                                │
│  Quads: 5/10                           │
│  Hamstrings: 3/10                      │
│  Shoulders: 2/10                       │
├─────────────────────────────────────────┤
│  RECOVERY ACTIVITIES                    │
│  ☑ Foam rolling (15 min)               │
│  ☑ Ice bath (12 min)                   │
│  ☐ Sports massage                      │
│  ☐ Yoga/stretching                     │
│  [+ Add activity]                       │
├─────────────────────────────────────────┤
│  NOTES                                  │
│  ________________________________        │
│  ________________________________        │
│                                         │
│  [SAVE LOG]                             │
└─────────────────────────────────────────┘
```

---

## MOBILE CONSIDERATIONS

### Key Mobile Features

1. **Offline Mode**
   - Download week's sessions at start of week
   - Log exercises offline, sync when connected
   - Critical for gym/field environments with poor connectivity

2. **Session Timer**
   - Built-in timer for rest periods
   - Vibration/sound alerts
   - Background operation

3. **Video Downloads**
   - Pre-download exercise videos
   - Adjustable quality for bandwidth

4. **Quick Logging**
   - Swipe gestures to mark sets complete
   - Voice-to-text for notes
   - Camera integration for form videos

5. **Apple Health / Google Fit Integration**
   - Import sleep data
   - Import activity data
   - Export workout data

---

## PERFORMANCE OPTIMIZATION

### Database Indexing Strategy

```sql
-- Critical indexes for fast queries
CREATE INDEX CONCURRENTLY idx_sessions_athlete_date
    ON training_sessions(athlete_id, session_date DESC);

CREATE INDEX CONCURRENTLY idx_exercise_completions_athlete_date
    ON exercise_completions(athlete_id, completed_at DESC);

CREATE INDEX CONCURRENTLY idx_performance_tests_athlete_category
    ON performance_tests(athlete_id, test_category, test_date DESC);

-- Partial indexes for active plans
CREATE INDEX CONCURRENTLY idx_active_plans
    ON training_plans(athlete_id, status)
    WHERE status = 'active';

-- GIN indexes for JSONB queries
CREATE INDEX CONCURRENTLY idx_exercises_sports_gin
    ON exercises_library USING GIN(sports);

CREATE INDEX CONCURRENTLY idx_exercises_positions_gin
    ON exercises_library USING GIN(positions);
```

### Caching Strategy

```javascript
// Redis cache keys
const CACHE_KEYS = {
    athleteProfile: (athleteId) => `athlete:${athleteId}:profile`,
    activePlan: (athleteId) => `athlete:${athleteId}:active_plan`,
    todaySession: (athleteId) => `athlete:${athleteId}:session:today`,
    exerciseLibrary: (sport, position) => `exercises:${sport}:${position}`,
    performanceHistory: (athleteId, testName) => `performance:${athleteId}:${testName}`
};

// Cache TTLs
const CACHE_TTL = {
    athleteProfile: 3600, // 1 hour
    activePlan: 3600,
    todaySession: 1800, // 30 minutes
    exerciseLibrary: 86400, // 24 hours
    performanceHistory: 3600
};
```

### API Response Optimization

```javascript
// Example optimized query with joins
async function getTodaySession(athleteId) {
    const today = new Date().toISOString().split('T')[0];

    // Single query with joins instead of multiple queries
    const result = await db.query(`
        SELECT
            ts.*,
            tp.plan_name,
            tp.current_week,
            json_agg(
                json_build_object(
                    'exercise_id', el.exercise_id,
                    'exercise_name', el.exercise_name,
                    'video_url', el.video_url,
                    'coaching_cues', el.coaching_cues,
                    'planned_sets', (ts.exercises->el.exercise_id::text->>'sets')::int,
                    'planned_reps', (ts.exercises->el.exercise_id::text->>'reps')::int
                )
            ) as exercise_details
        FROM training_sessions ts
        JOIN training_plans tp ON ts.plan_id = tp.plan_id
        JOIN exercises_library el ON el.exercise_id IN (
            SELECT jsonb_object_keys(ts.exercises)::uuid
        )
        WHERE ts.athlete_id = $1
        AND ts.session_date = $2
        GROUP BY ts.session_id, tp.plan_id
    `, [athleteId, today]);

    return result.rows[0];
}
```

---

## TESTING REQUIREMENTS

### Unit Tests

```javascript
describe('Plan Generation Algorithm', () => {
    test('should categorize point guard as Power-Endurance', () => {
        const category = categorizePosition('Basketball', 'Point Guard');
        expect(category).toBe('Power-Endurance');
    });

    test('should generate 5 sessions for 5-day athlete', () => {
        const plan = generateTrainingPlan({
            sport: 'Basketball',
            position: 'Point Guard',
            experience_level: 'Intermediate',
            training_days_available: 5,
            session_duration_minutes: 90
        }, {
            plan_duration_weeks: 8,
            start_date: '2025-01-15'
        });

        expect(plan.weekly_structure[0].sessions.length).toBe(5);
    });

    test('should apply injury modifications correctly', () => {
        const injuries = [
            { type: 'patellar_tendinitis', restrictions: ['high_volume_jumping'] }
        ];

        const exercises = [
            { exercise_code: 'box_jump', category: 'Power' },
            { exercise_code: 'trap_bar_deadlift', category: 'Strength' }
        ];

        const modified = applyInjuryModifications([{ sessions: [{ exercises }] }], injuries);

        // Box jumps should be removed
        expect(modified[0].sessions[0].exercises.length).toBe(1);
        expect(modified[0].sessions[0].exercises[0].exercise_code).toBe('trap_bar_deadlift');
    });
});

describe('Nutrition Calculations', () => {
    test('should calculate correct caloric needs', () => {
        const protocol = generateNutritionProtocol({
            age: 20,
            gender: 'male',
            weight_kg: 80,
            height_cm: 185,
            sport: 'Basketball',
            position: 'Point Guard'
        }, 'Power-Endurance');

        expect(protocol.daily_calories).toBeGreaterThan(2800);
        expect(protocol.daily_calories).toBeLessThan(3800);
    });
});
```

### Integration Tests

```javascript
describe('API Endpoints', () => {
    test('POST /api/v1/training-plans/generate creates valid plan', async () => {
        const response = await request(app)
            .post('/api/v1/training-plans/generate')
            .send({
                athlete_id: testAthleteId,
                plan_duration_weeks: 8,
                start_date: '2025-01-15'
            });

        expect(response.status).toBe(200);
        expect(response.body.plan_id).toBeDefined();
        expect(response.body.weekly_structure.length).toBe(8);

        // Verify plan saved to database
        const plan = await db.query(
            'SELECT * FROM training_plans WHERE plan_id = $1',
            [response.body.plan_id]
        );
        expect(plan.rows.length).toBe(1);
    });

    test('GET /api/v1/training-sessions/today returns correct session', async () => {
        // Setup: Create plan and session for today
        await setupTodaySession(testAthleteId);

        const response = await request(app)
            .get('/api/v1/training-sessions/today')
            .query({ athlete_id: testAthleteId });

        expect(response.status).toBe(200);
        expect(response.body.session_date).toBe(today);
        expect(response.body.exercises).toBeDefined();
    });
});
```

---

## DEPLOYMENT CONSIDERATIONS

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/athlete_db
DATABASE_POOL_SIZE=20

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_TTL_DEFAULT=3600

# AWS S3 (for videos/images)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=athlete-dashboard-media
AWS_REGION=us-east-1

# API Keys
STRIPE_SECRET_KEY=xxx  # For subscriptions
SENDGRID_API_KEY=xxx   # For emails

# App Config
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_VIDEO_DOWNLOADS=true
ENABLE_AI_COACHING=false
```

### Scaling Architecture

```
┌─────────────┐
│   Clients   │
│ (Web/Mobile)│
└──────┬──────┘
       │
┌──────▼──────┐
│  CDN        │ (Static assets, videos)
└──────┬──────┘
       │
┌──────▼──────────┐
│  Load Balancer  │
└──────┬──────────┘
       │
┌──────▼──────────────────────┐
│  API Servers (Auto-scaling) │
│  Node.js / Express          │
└──────┬──────────────────────┘
       │
┌──────▼───────┬────────────┐
│  PostgreSQL  │   Redis    │
│  (Primary +  │  (Cache)   │
│   Replicas)  │            │
└──────────────┴────────────┘
```

---

## CONCLUSION

This implementation guide provides the complete technical specification for building the training curriculum framework into your athlete dashboard app. Key components include:

1. **Comprehensive database schema** supporting all training plan features
2. **RESTful API endpoints** for all CRUD operations
3. **Algorithmic plan generation** with full customization
4. **UI/UX component specifications** for key app screens
5. **Performance optimization strategies** for scale
6. **Testing frameworks** to ensure reliability

### Next Steps for Development Team:

1. Set up database with provided schema
2. Implement core API endpoints starting with onboarding
3. Build plan generation algorithm with test coverage
4. Populate exercise library with position-specific exercises and videos
5. Develop UI components starting with dashboard and session view
6. Implement offline mode for mobile apps
7. Set up analytics and progress tracking
8. Beta test with real athletes and iterate

This framework positions your app as a comprehensive, elite-level training platform suitable for athletes from beginner through professional levels.
