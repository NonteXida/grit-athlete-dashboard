# AthleteHub - High School Athlete Performance Dashboard

A modern, motivational platform for high school athletes combining personal branding, training programs, and performance tracking. Built with React, Tailwind CSS, and Supabase.

## 🎯 Overview

AthleteHub is designed to help high school athletes:
- Build a professional athletic profile with highlights and achievements
- Track training, nutrition, and performance metrics
- Set and achieve SMART goals with coach feedback
- Showcase character development alongside athletic achievements
- Share their journey with college recruiters, coaches, and supporters

## 🎨 Brand & Design

- **Colors**: Deep black (#0a0a0a), electric green (#03fd1c), white
- **Typography**: Bold, athletic, clean (Nike/Under Armour inspired)
- **Mood**: Motivational, professional, achievement-focused
- **Responsive**: Mobile-first design, works beautifully on all devices

## ✨ Features

### 🏠 Dashboard Home
- Hero section with athlete name, sport, school, graduation year
- "This Week's Training" module with upcoming workouts
- Recent highlights/media carousel
- Progress rings for weekly goals (workouts, nutrition, recovery)
- Motivational quote of the day
- Quick stats: days trained, highlights uploaded, profile views

### 👤 Profile Section
- Cover photo & profile photo upload
- Bio/personal story editor
- Sports & positions
- Academic info (GPA, graduation year)
- Character traits/values showcase
- Achievement timeline (athletic & character-based)
- Embedded highlight reel player
- Photo gallery grid
- Coach testimonials

### 💪 Training Hub
- Weekly calendar view with workout schedule
- Exercise library with categories
- Workout logger with sets/reps/weight tracking
- Progress graphs for key metrics
- Sport-specific training programs
- Customizable workout builder
- Rest day and recovery tracking

### 🍎 Nutrition Module
- Daily meal planner with meal breakdown
- Calorie/macro tracker (protein, carbs, fats)
- Hydration tracker with visual indicators
- Supplement schedule
- Pre/post workout nutrition tips
- Recipe library filtered by dietary needs

### 📸 Media Center
- Video upload for highlights
- Photo gallery management
- Content analytics (views, engagement)
- Social media link integration
- Share buttons for profiles/highlights
- Privacy controls (public/private/team-only)

### 🎯 Goal Tracking
- SMART goal creator (Specific, Measurable, Achievable, Relevant, Time-bound)
- Progress milestones with completion tracking
- Coach feedback section
- Weekly check-ins with mood tracking
- Achievement badges (effort-based, not just performance)
- Grit Score - measures consistency, effort, and improvement

## 🏗️ Architecture

### Frontend
- **React** - UI framework
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization (ready to integrate)

### Backend
- **Supabase** - Authentication, database, storage
- **Hono** - Edge functions web server
- **Key-Value Store** - Data persistence

### User Types
1. **Athletes** (primary) - Full access to all features
2. **Coaches** - View/comment on athlete profiles, assign workouts
3. **Parents** - Limited access to their child's profile
4. **Public Visitors** - View-only for public profiles

## 🚀 Getting Started

### Prerequisites
- Supabase account (automatically connected)
- Modern web browser

### Authentication

The app uses Supabase Auth with email/password authentication:

1. **Sign Up**: Create an account as an athlete, coach, or parent
2. **Sign In**: Access your dashboard with email and password
3. **Profile Setup**: Complete your profile with personal information

### Demo Credentials

For testing purposes, you can create a new account or use these sample credentials:
- Email: `demo@athletehub.com`
- Password: `demo123456`

## 📊 Data Structure

All data is stored in Supabase's key-value store with the following structure:

### Key Prefixes
- `profile:{userId}` - User profile data
- `workouts:{userId}` - Workout logs and training data
- `nutrition:{userId}` - Nutrition logs and meal tracking
- `goals:{userId}` - Goal tracking and milestones
- `media:{userId}` - Photos and videos
- `achievements:{userId}` - Athletic and character achievements
- `testimonials:{userId}` - Coach testimonials
- `teams:{teamId}` - Team information
- `programs:{programId}` - Training programs

See `DATABASE_SCHEMA.md` for detailed data structure documentation.

## 🔌 API Endpoints

### Authentication
- `POST /make-server-eec32171/signup` - Create new user
- Sign in handled by Supabase Auth

### Profile
- `GET /make-server-eec32171/profile/:userId` - Get user profile
- `PUT /make-server-eec32171/profile` - Update profile (auth required)

### Training
- `GET /make-server-eec32171/workouts` - Get all workouts
- `POST /make-server-eec32171/workouts` - Log new workout

### Nutrition
- `GET /make-server-eec32171/nutrition` - Get nutrition logs
- `POST /make-server-eec32171/nutrition` - Log meal/nutrition

### Goals
- `GET /make-server-eec32171/goals` - Get all goals
- `POST /make-server-eec32171/goals` - Create new goal
- `PUT /make-server-eec32171/goals/:goalId` - Update goal

### Media
- `GET /make-server-eec32171/media` - Get all media
- `POST /make-server-eec32171/media` - Upload new media

## 🎮 Usage

### For Athletes

1. **Complete Your Profile**
   - Upload cover and profile photos
   - Write your bio and personal story
   - Add your stats, achievements, and character traits
   - Upload highlight reels and photos

2. **Track Your Training**
   - View your weekly workout schedule
   - Log completed exercises with sets, reps, and weight
   - Monitor progress on key lifts and performance metrics

3. **Monitor Nutrition**
   - Log meals throughout the day
   - Track macros (protein, carbs, fats)
   - Monitor hydration and supplement intake

4. **Set Goals**
   - Create SMART goals for athletic and academic achievements
   - Track progress with milestones
   - Receive feedback from coaches
   - Complete weekly check-ins

### For Coaches

1. View assigned athlete profiles
2. Provide feedback on workouts and goals
3. Create and assign training programs
4. Write testimonials for athletes

### For Parents

1. View your child's progress and achievements
2. Monitor training consistency and nutrition
3. Celebrate milestones and improvements

## 📱 Mobile Experience

The app is fully responsive and works great on mobile devices:
- Touch-friendly interface with large tap targets
- Mobile-optimized navigation with hamburger menu
- Swipeable workout logging
- Progressive Web App (PWA) ready for offline functionality

## 🔒 Privacy & Security

- **Privacy Controls**: Public, private, or team-only visibility for profiles and media
- **Secure Authentication**: Supabase Auth with email confirmation
- **Data Protection**: User data is isolated by userId
- **Parent Consent**: Athletes under 18 require parent/guardian consent

## 🌟 Unique Features

### Grit Score
A proprietary metric measuring:
- **Consistency** (30%) - Workout completion rate and streaks
- **Improvement** (30%) - Progress toward goals
- **Effort** (25%) - Challenging workout completion
- **Accountability** (15%) - Regular check-ins and honesty

### Character Spotlight
Focus on character development, not just athletic performance:
- Leadership examples
- Work ethic demonstrations
- Coachability moments
- Team player recognition

### Team Leaderboards
Based on effort and participation, not just results:
- Encourages consistency over natural talent
- Promotes healthy competition
- Recognizes improvement and dedication

## 🛠️ Customization

### Adding Sports
To add new sports, update the form options in `AuthPage.tsx` and add sport-specific training programs in the Training Hub.

### Custom Workouts
Coaches can create custom workout programs by:
1. Defining exercises with sets/reps/rest periods
2. Organizing into weekly schedules
3. Assigning to individual athletes or teams

### Privacy Settings
Athletes can control who sees their content:
- **Public**: Anyone with the link
- **Team Only**: Teammates and coaches only
- **Private**: Only athlete and assigned coaches/parents

## 📈 Future Enhancements

- [ ] Integration with wearable devices (Apple Watch, Fitbit)
- [ ] AI-powered coaching recommendations
- [ ] Video analysis using Frame.io
- [ ] Team messaging and social features
- [ ] College recruiting profile export
- [ ] Event scheduling and attendance tracking
- [ ] Nutrition barcode scanner
- [ ] Workout video demonstrations
- [ ] Social sharing to Instagram/Twitter
- [ ] PDF profile export for recruiters

## 🤝 Contributing

This is a prototype platform. Future development could include:
- Additional sports-specific features
- Advanced analytics and insights
- Integration with college recruiting platforms
- Team management tools for coaches
- Parent communication features

## 📄 License

This project is created as a demonstration of a comprehensive athlete dashboard platform.

## 💬 Support

For questions or feedback about AthleteHub:
- Review the `DATABASE_SCHEMA.md` for technical details
- Check component documentation in source files
- Test all features with the demo account

## 🙏 Acknowledgments

Inspired by:
- Nike Training Club for motivational design
- Hudl for athletic video analysis
- LinkedIn for professional profile features
- MyFitnessPal for nutrition tracking

---

Built with ❤️ for student athletes pursuing their dreams.
