# Component Library Documentation

## Overview

This document describes all custom components created for the AthleteHub platform.

## Layout Components

### Sidebar
**File:** `/components/Sidebar.tsx`

Navigation sidebar with menu items and logout functionality.

**Props:**
- `currentPage: string` - Currently active page
- `onNavigate: (page: string) => void` - Page navigation handler
- `onLogout: () => void` - Logout handler
- `isMobileOpen: boolean` - Mobile menu open state
- `onToggleMobile: () => void` - Mobile menu toggle handler

**Features:**
- Responsive design with mobile hamburger menu
- Active state highlighting
- Icon-based navigation
- Logo display

**Usage:**
```tsx
<Sidebar
  currentPage="dashboard"
  onNavigate={setCurrentPage}
  onLogout={handleLogout}
  isMobileOpen={isMobileMenuOpen}
  onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
/>
```

## Page Components

### DashboardHome
**File:** `/components/DashboardHome.tsx`

Main dashboard with hero section, stats, and quick links.

**Props:**
- `userData: any` - User profile data

**Features:**
- Hero section with athlete info
- Quick stats cards with trends
- Weekly goals progress rings
- Motivational quote
- This week's training schedule
- Recent highlights carousel

### AthleteProfile
**File:** `/components/AthleteProfile.tsx`

Complete athlete profile with editing capabilities.

**Props:**
- `userData: any` - User profile data
- `onUpdate: (data: any) => void` - Profile update handler

**Features:**
- Cover photo and profile photo upload
- Editable bio section
- Stats display (height, weight, position, etc.)
- Character traits showcase
- Achievement timeline
- Coach testimonials
- Highlight reel section

### TrainingHub
**File:** `/components/TrainingHub.tsx`

Training tracking and workout logging interface.

**Props:**
- `onSaveWorkout: (workout: any) => void` - Workout save handler

**Features:**
- Weekly calendar view
- Daily workout details
- Exercise completion tracking
- Progress graphs
- Exercise library preview
- Set/rep/weight logging

### NutritionModule
**File:** `/components/NutritionModule.tsx`

Nutrition tracking and meal planning interface.

**Features:**
- Daily macro tracking (calories, protein, carbs, fats)
- Meal-by-meal breakdown
- Hydration tracker
- Supplement schedule
- Recipe library
- Progress rings for nutrition goals

### MediaCenter
**File:** `/components/MediaCenter.tsx`

Media management for videos and photos.

**Features:**
- Video and photo tabs
- Analytics overview
- Grid layout for media
- Share and delete actions
- View count tracking
- Upload interface

### GoalTracking
**File:** `/components/GoalTracking.tsx`

Goal setting and progress tracking interface.

**Features:**
- Grit Score display
- Active goals with progress bars
- Milestone tracking
- Coach feedback section
- Completed goals history
- Achievement badges
- Weekly check-in form

### AuthPage
**File:** `/components/AuthPage.tsx`

Authentication page for login and signup.

**Props:**
- `onLogin: (email: string, password: string) => void` - Login handler
- `onSignup: (userData: any) => void` - Signup handler

**Features:**
- Toggle between login and signup
- User type selection (athlete/coach/parent)
- Sport-specific fields for athletes
- Hero section with feature highlights
- Responsive split layout

## UI Components

### Button
**File:** `/components/Button.tsx`

Reusable button component with variants.

**Props:**
- `variant: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style
- `size: 'sm' | 'md' | 'lg'` - Button size
- `children: React.ReactNode` - Button content
- All standard button HTML attributes

**Variants:**
- **Primary**: Electric green background (`#03fd1c`)
- **Secondary**: White background
- **Outline**: Transparent with green border
- **Ghost**: Transparent with hover effect

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### StatCard
**File:** `/components/StatCard.tsx`

Card component for displaying statistics.

**Props:**
- `icon: LucideIcon` - Icon component from lucide-react
- `label: string` - Stat label
- `value: string | number` - Stat value
- `trend?: { value: number, isPositive: boolean }` - Optional trend indicator
- `onClick?: () => void` - Optional click handler

**Usage:**
```tsx
<StatCard
  icon={Calendar}
  label="Days Trained"
  value={12}
  trend={{ value: 20, isPositive: true }}
/>
```

### ProgressRing
**File:** `/components/ProgressRing.tsx`

Circular progress indicator.

**Props:**
- `progress: number` - Progress value (0-100)
- `size?: number` - Ring size in pixels (default: 120)
- `strokeWidth?: number` - Ring thickness (default: 8)
- `label: string` - Label below ring
- `value?: string` - Optional value text

**Usage:**
```tsx
<ProgressRing
  progress={75}
  label="Workouts"
  value="4/5 days"
  size={100}
/>
```

### Toast
**File:** `/components/Toast.tsx`

Toast notification for user feedback.

**Props:**
- `type: 'success' | 'error' | 'info'` - Toast type
- `message: string` - Notification message
- `isVisible: boolean` - Visibility state
- `onClose: () => void` - Close handler
- `duration?: number` - Auto-hide duration in ms (default: 3000)

**Hook:**
```tsx
const { toast, showToast, hideToast } = useToast();

// Show toast
showToast('success', 'Workout logged successfully!');

// Render toast
<Toast {...toast} onClose={hideToast} />
```

## State Components

### LoadingState
**File:** `/components/LoadingState.tsx`

Loading indicator with optional message.

**Props:**
- `message?: string` - Loading message (default: "Loading...")

**Components:**
- `LoadingState` - Full loading screen
- `SkeletonCard` - Card skeleton loader
- `SkeletonTable` - Table skeleton loader

**Usage:**
```tsx
{loading ? <LoadingState message="Loading workouts..." /> : <WorkoutList />}
```

### EmptyState
**File:** `/components/EmptyState.tsx`

Empty state placeholder with optional action.

**Props:**
- `icon: LucideIcon` - Icon to display
- `title: string` - Empty state title
- `description: string` - Empty state description
- `actionLabel?: string` - Optional action button text
- `onAction?: () => void` - Optional action handler

**Usage:**
```tsx
<EmptyState
  icon={Dumbbell}
  title="No workouts yet"
  description="Start tracking your training to see your progress"
  actionLabel="Log First Workout"
  onAction={handleLogWorkout}
/>
```

### ErrorState
**File:** `/components/ErrorState.tsx`

Error state with retry option.

**Props:**
- `title?: string` - Error title (default: "Something went wrong")
- `message: string` - Error message
- `onRetry?: () => void` - Optional retry handler

**Usage:**
```tsx
{error && (
  <ErrorState
    message="Failed to load workouts"
    onRetry={fetchWorkouts}
  />
)}
```

### CelebrationModal
**File:** `/components/CelebrationModal.tsx`

Modal for celebrating achievements.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `title: string` - Achievement title
- `message: string` - Celebration message
- `achievement?: string` - Optional achievement badge text

**Features:**
- Animated entrance
- Trophy icon with pulse animation
- Share button
- Auto-close after 5 seconds
- Decorative particle effects

**Usage:**
```tsx
<CelebrationModal
  isOpen={showCelebration}
  onClose={() => setShowCelebration(false)}
  title="Goal Achieved!"
  message="You reached your bench press goal of 225 lbs!"
  achievement="Iron Will Badge Unlocked"
/>
```

## Utility Components

### ImageWithFallback
**File:** `/components/figma/ImageWithFallback.tsx` (Protected)

Image component with fallback handling. Use this for all images in the app.

**Props:**
- Standard img element props
- `src: string` - Image URL
- `alt: string` - Alt text
- `className?: string` - Optional CSS classes

**Usage:**
```tsx
<ImageWithFallback
  src="https://..."
  alt="Athlete training"
  className="w-full h-48 object-cover"
/>
```

## Component Patterns

### Card Layout
Most content is organized in cards with consistent styling:

```tsx
<div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
  {/* Card content */}
</div>
```

### Nested Cards
For emphasis within a card:

```tsx
<div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
  {/* Nested content */}
</div>
```

### Hover Effects
Interactive elements should have hover states:

```tsx
className="hover:border-[#03fd1c] transition-all cursor-pointer"
```

### Grid Layouts
Responsive grid patterns:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Flex Layouts
Common flex patterns:

```tsx
{/* Space between */}
<div className="flex items-center justify-between">

{/* Centered */}
<div className="flex items-center justify-center">

{/* Gap spacing */}
<div className="flex items-center gap-4">
```

## Color Usage

### Primary Colors
- **Electric Green**: `#03fd1c` - Primary actions, highlights, success
- **Dark Background**: `#0a0a0a` - Main background
- **Card Background**: `#141414` - Card surfaces
- **Border**: `#252525` - Dividers and borders

### Semantic Colors
- **Success**: `#03fd1c` (electric green)
- **Error**: `red-500` - Errors and destructive actions
- **Warning**: `yellow-500` - Warnings
- **Info**: `blue-500` - Informational messages

### Text Colors
- **Primary Text**: `white` - Main content
- **Secondary Text**: `gray-300` - Body text
- **Tertiary Text**: `gray-400` - Labels and captions
- **Disabled Text**: `gray-500` - Disabled states

## Animation Classes

### Available Animations
- `animate-slide-in-up` - Slide in from bottom
- `animate-pulse` - Gentle pulse effect
- `animate-spin` - Continuous rotation

### Transition Pattern
```tsx
className="transition-all duration-200"
```

## Responsive Breakpoints

### Tailwind Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Mobile-First Pattern
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
</div>
```

## Best Practices

1. **Always use ImageWithFallback** for images
2. **Provide loading states** for async operations
3. **Include empty states** for lists that can be empty
4. **Show error states** with retry options
5. **Use consistent spacing** (gap-4, gap-6, p-4, p-6)
6. **Maintain color consistency** with CSS variables
7. **Keep animations subtle** for professional feel
8. **Test on mobile** - mobile-first approach
9. **Provide feedback** for user actions (toasts, celebrations)
10. **Use semantic HTML** for accessibility

## Testing Components

### Quick Test Checklist
- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] Responsive on mobile, tablet, desktop
- [ ] Hover states work correctly
- [ ] Click handlers fire properly
- [ ] Loading states display correctly
- [ ] Empty states are handled
- [ ] Error states show appropriate messages
- [ ] Animations are smooth
- [ ] Accessibility (keyboard nav, screen readers)

## Future Components

Potential components to add:
- Social share buttons
- Video player with controls
- Chart components (using recharts)
- Calendar picker
- File upload with drag-and-drop
- Search and filter bars
- Notification bell with dropdown
- Chat/messaging interface
- Team roster display
- Schedule calendar view
