# AthleteHub Database Schema & API Documentation

## Overview

This application uses Supabase's key-value store for data persistence. All data is stored using prefixed keys to organize different types of information.

## Data Structure

### User Profile
**Key:** `profile:{userId}`

```typescript
{
  userId: string,
  email: string,
  name: string,
  userType: 'athlete' | 'coach' | 'parent',
  school?: string,
  sport?: string,
  gradYear?: string,
  position?: string,
  jersey?: string,
  height?: string,
  weight?: string,
  bio?: string,
  gpa?: number,
  coverPhoto?: string,
  profilePhoto?: string,
  characterTraits?: Array<{
    trait: string,
    description: string
  }>,
  socialLinks?: {
    twitter?: string,
    instagram?: string,
    hudl?: string
  },
  createdAt: string,
  updatedAt?: string
}
```

### Workouts
**Key:** `workouts:{userId}`

```typescript
Array<{
  id: string,
  userId: string,
  date: string,
  name: string,
  category: 'strength' | 'cardio' | 'speed' | 'sport-specific' | 'recovery',
  duration: number, // minutes
  exercises: Array<{
    name: string,
    sets: number,
    reps: number,
    weight?: number,
    time?: number,
    distance?: number,
    notes?: string,
    completed: boolean
  }>,
  completed: boolean,
  coachFeedback?: string,
  createdAt: string
}>
```

### Nutrition Logs
**Key:** `nutrition:{userId}`

```typescript
Array<{
  id: string,
  userId: string,
  date: string,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  time: string,
  items: Array<{
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    servingSize?: string
  }>,
  totalCalories: number,
  totalProtein: number,
  totalCarbs: number,
  totalFats: number,
  waterIntake?: number, // ounces
  supplements?: Array<{
    name: string,
    dosage: string,
    taken: boolean
  }>,
  createdAt: string
}>
```

### Goals
**Key:** `goals:{userId}`

```typescript
Array<{
  id: string,
  userId: string,
  title: string,
  description?: string,
  category: 'strength' | 'speed' | 'academic' | 'character' | 'skill',
  type: 'SMART', // Specific, Measurable, Achievable, Relevant, Time-bound
  current: number,
  target: number,
  unit: string,
  deadline: string,
  progress: number, // 0-100
  status: 'active' | 'completed' | 'abandoned',
  milestones?: Array<{
    value: number,
    achieved: boolean,
    date?: string
  }>,
  coachFeedback?: Array<{
    coachId: string,
    coach: string,
    message: string,
    date: string
  }>,
  checkIns?: Array<{
    date: string,
    feeling: number, // 1-5
    challenges: string,
    wins: string
  }>,
  createdAt: string,
  completedAt?: string
}>
```

### Media
**Key:** `media:{userId}`

```typescript
Array<{
  id: string,
  userId: string,
  type: 'video' | 'photo',
  title: string,
  description?: string,
  url: string,
  thumbnail?: string,
  duration?: number, // for videos, in seconds
  fileSize?: number,
  tags?: string[],
  event?: string,
  date: string,
  views: number,
  visibility: 'public' | 'private' | 'team-only',
  reactions?: Array<{
    userId: string,
    type: 'like' | 'celebrate' | 'inspire'
  }>,
  comments?: Array<{
    userId: string,
    name: string,
    message: string,
    date: string
  }>,
  createdAt: string
}>
```

### Achievements
**Key:** `achievements:{userId}`

```typescript
Array<{
  id: string,
  userId: string,
  year: string,
  title: string,
  description: string,
  category: 'athletic' | 'academic' | 'character' | 'community',
  type: 'award' | 'milestone' | 'recognition',
  icon?: string,
  createdAt: string
}>
```

### Testimonials
**Key:** `testimonials:{userId}`

```typescript
Array<{
  id: string,
  athleteId: string,
  authorId?: string,
  authorName: string,
  authorRole: string, // 'Head Coach', 'Assistant Coach', 'Trainer', etc.
  authorPhoto?: string,
  text: string,
  rating?: number,
  approved: boolean,
  createdAt: string
}>
```

### Teams
**Key:** `teams:{teamId}`

```typescript
{
  id: string,
  name: string,
  school: string,
  sport: string,
  season: string,
  coaches: Array<{
    userId: string,
    name: string,
    role: string
  }>,
  athletes: string[], // array of user IDs
  leaderboard?: Array<{
    userId: string,
    name: string,
    gritScore: number,
    workoutsCompleted: number,
    consistencyScore: number
  }>,
  createdAt: string
}
```

### Training Programs
**Key:** `programs:{programId}`

```typescript
{
  id: string,
  name: string,
  description: string,
  sport: string,
  position?: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  duration: number, // weeks
  createdBy: string, // coach userId
  weeks: Array<{
    week: number,
    focus: string,
    workouts: Array<{
      day: string,
      name: string,
      exercises: Array<{
        name: string,
        sets: number,
        reps: number,
        rest: number,
        notes?: string
      }>
    }>
  }>,
  assignedTo?: string[], // array of athlete user IDs
  createdAt: string
}
```

## API Endpoints

### Authentication

#### POST `/make-server-eec32171/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "athlete@email.com",
  "password": "securepassword",
  "name": "Jordan Martinez",
  "school": "Lincoln High School",
  "sport": "Football",
  "gradYear": "2025",
  "userType": "athlete"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "athlete@email.com",
    "name": "Jordan Martinez",
    "userType": "athlete"
  }
}
```

### Profile

#### GET `/make-server-eec32171/profile/:userId`
Get user profile by ID.

**Headers:**
```
Authorization: Bearer {publicAnonKey}
```

**Response:**
```json
{
  "profile": {
    "userId": "uuid",
    "email": "athlete@email.com",
    "name": "Jordan Martinez",
    "school": "Lincoln High School",
    "sport": "Football",
    "gradYear": "2025",
    ...
  }
}
```

#### PUT `/make-server-eec32171/profile`
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "gpa": 3.7,
  "position": "Running Back"
}
```

### Workouts

#### GET `/make-server-eec32171/workouts`
Get all workouts for authenticated user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

#### POST `/make-server-eec32171/workouts`
Create a new workout log.

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2024-11-07",
  "name": "Upper Body Strength",
  "category": "strength",
  "duration": 60,
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185,
      "completed": true
    }
  ],
  "completed": true
}
```

### Nutrition

#### GET `/make-server-eec32171/nutrition`
Get nutrition logs for authenticated user.

#### POST `/make-server-eec32171/nutrition`
Create a new nutrition log.

**Request Body:**
```json
{
  "date": "2024-11-07",
  "mealType": "breakfast",
  "time": "7:00 AM",
  "items": [
    {
      "name": "Scrambled Eggs",
      "calories": 280,
      "protein": 24,
      "carbs": 2,
      "fats": 20
    }
  ],
  "waterIntake": 16
}
```

### Goals

#### GET `/make-server-eec32171/goals`
Get all goals for authenticated user.

#### POST `/make-server-eec32171/goals`
Create a new goal.

**Request Body:**
```json
{
  "title": "Bench Press 225 lbs",
  "category": "strength",
  "current": 185,
  "target": 225,
  "unit": "lbs",
  "deadline": "2024-12-31"
}
```

#### PUT `/make-server-eec32171/goals/:goalId`
Update a goal's progress or details.

**Request Body:**
```json
{
  "current": 195,
  "progress": 50
}
```

### Media

#### GET `/make-server-eec32171/media`
Get all media for authenticated user.

#### POST `/make-server-eec32171/media`
Upload new media.

**Request Body:**
```json
{
  "type": "video",
  "title": "Championship Game Highlights",
  "url": "https://...",
  "thumbnail": "https://...",
  "duration": 225,
  "visibility": "public"
}
```

## Grit Score Calculation

The Grit Score is a composite metric measuring:

1. **Consistency (30%)**: Workout completion rate and streak length
2. **Improvement (30%)**: Progress toward goals and performance increases
3. **Effort (25%)**: Completion of challenging workouts and pushing limits
4. **Accountability (15%)**: Regular check-ins and honest self-assessment

Formula:
```
GritScore = (Consistency × 0.30) + (Improvement × 0.30) + (Effort × 0.25) + (Accountability × 0.15)
```

## Privacy Levels

- **Public**: Visible to anyone with the profile link
- **Team-only**: Visible to teammates and coaches
- **Private**: Only visible to the athlete and their assigned coaches/parents

## User Relationships

### Athletes
- Can have multiple coaches
- Can have parent/guardian access
- Belong to teams/schools

### Coaches
- Can view assigned athlete profiles
- Can provide feedback on workouts and goals
- Can create and assign training programs

### Parents
- Limited access to their child's profile
- Can view progress and achievements
- Cannot edit athlete's data

## Best Practices

1. **Data Privacy**: Always respect privacy settings when fetching user data
2. **Media Storage**: Store large media files in Supabase Storage, not in KV store
3. **Real-time Updates**: Use webhooks for notifications when coaches add feedback
4. **Data Validation**: Validate all user inputs on both client and server
5. **Pagination**: Implement pagination for large datasets (workouts, media)

## Future Enhancements

- Integration with wearable devices (Apple Watch, Fitbit)
- AI-powered coaching recommendations
- Video analysis using Frame.io
- Team messaging and social features
- College recruiting integration
- Event scheduling and attendance tracking
