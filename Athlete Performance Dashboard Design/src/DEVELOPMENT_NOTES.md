# Development Notes - AthleteHub

## Project Overview

AthleteHub is a comprehensive high school athlete performance dashboard built with React, Tailwind CSS, and Supabase. The platform combines personal branding, training programs, and performance tracking in a premium, motivational interface.

## Technology Stack

### Frontend
- **React** - UI framework with hooks
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Icon library
- **TypeScript/JSX** - Type-safe component development

### Backend
- **Supabase Auth** - User authentication
- **Supabase KV Store** - Data persistence
- **Hono** - Edge functions web server
- **Deno** - Server runtime environment

### Planned Integrations
- **Recharts** - Data visualization
- **Frame.io** - Video processing (webhook ready)
- **Wearable APIs** - Apple Health, Fitbit integration

## Architecture Decisions

### Three-Tier Architecture
```
Frontend (React) → Server (Hono) → Database (KV Store)
```

### Why Key-Value Store?
- **Flexibility**: Schema-less design perfect for rapid prototyping
- **Simplicity**: No complex migrations needed
- **Speed**: Fast read/write operations
- **Prototyping**: Easy to iterate on data structures

For production, consider migrating to PostgreSQL tables for:
- Complex queries (filtering, sorting, joins)
- Relational data integrity
- Better indexing and performance at scale

### Data Organization
All data is organized by userId with prefixed keys:
- `profile:{userId}` - User profiles
- `workouts:{userId}` - Training data
- `nutrition:{userId}` - Meal logs
- `goals:{userId}` - Goal tracking
- `media:{userId}` - Photos and videos

This pattern ensures data isolation and easy cleanup.

## Design System

### Brand Colors
```css
--primary-green: #03fd1c  /* Electric green - primary actions */
--dark-bg: #0a0a0a        /* Main background */
--card-bg: #141414        /* Card surfaces */
--border-color: #252525   /* Borders and dividers */
```

### Typography Scale
- **h1**: 3rem, weight 800 - Hero titles
- **h2**: 2rem, weight 700 - Section headers
- **h3**: 1.5rem, weight 700 - Card titles
- **h4**: 1.25rem, weight 600 - Subsections
- **p**: 1rem, line-height 1.6 - Body text

### Spacing System
- **Small**: gap-2, p-2 (8px)
- **Medium**: gap-4, p-4 (16px)
- **Large**: gap-6, p-6 (24px)
- **XL**: gap-8, p-8 (32px)

### Component Patterns
1. **Card Container**: `bg-[#141414] border border-[#252525] rounded-2xl p-6`
2. **Nested Card**: `bg-[#0a0a0a] border border-[#252525] rounded-lg p-4`
3. **Hover Effect**: `hover:border-[#03fd1c] transition-all`
4. **Active State**: `bg-[#03fd1c] text-black`

## File Structure

```
/
├── App.tsx                          # Main app with routing
├── components/
│   ├── DashboardHome.tsx           # Dashboard page
│   ├── AthleteProfile.tsx          # Profile page
│   ├── TrainingHub.tsx             # Training page
│   ├── NutritionModule.tsx         # Nutrition page
│   ├── MediaCenter.tsx             # Media page
│   ├── GoalTracking.tsx            # Goals page
│   ├── AuthPage.tsx                # Login/signup page
│   ├── Sidebar.tsx                 # Navigation sidebar
│   ├── Button.tsx                  # Button component
│   ├── StatCard.tsx                # Stat display card
│   ├── ProgressRing.tsx            # Circular progress
│   ├── Toast.tsx                   # Toast notifications
│   ├── LoadingState.tsx            # Loading indicators
│   ├── EmptyState.tsx              # Empty state placeholders
│   ├── ErrorState.tsx              # Error displays
│   ├── CelebrationModal.tsx        # Achievement celebrations
│   └── figma/
│       └── ImageWithFallback.tsx   # Protected image component
├── supabase/functions/server/
│   ├── index.tsx                   # API routes
│   └── kv_store.tsx                # KV store utilities (protected)
├── styles/
│   └── globals.css                 # Global styles and animations
└── utils/supabase/
    └── info.tsx                    # Supabase config (protected)
```

## API Routes

All routes are prefixed with `/make-server-eec32171/`

### Authentication
- `POST /signup` - Create new user account
- Login handled by Supabase Auth client-side

### Profile
- `GET /profile/:userId` - Get user profile (public)
- `PUT /profile` - Update profile (auth required)

### Training
- `GET /workouts` - Get all workouts (auth required)
- `POST /workouts` - Log new workout (auth required)

### Nutrition
- `GET /nutrition` - Get nutrition logs (auth required)
- `POST /nutrition` - Log meal (auth required)

### Goals
- `GET /goals` - Get all goals (auth required)
- `POST /goals` - Create new goal (auth required)
- `PUT /goals/:goalId` - Update goal (auth required)

### Media
- `GET /media` - Get all media (auth required)
- `POST /media` - Upload media (auth required)

### Health
- `GET /health` - Server health check

## Authentication Flow

### Sign Up
1. User fills signup form (AuthPage)
2. Frontend calls `/signup` endpoint
3. Server creates user with Supabase Auth
4. Server initializes user data in KV store
5. Frontend automatically logs user in
6. Redirect to dashboard

### Sign In
1. User fills login form (AuthPage)
2. Frontend calls Supabase Auth
3. Receives access token
4. Stores token in state
5. Fetches user profile
6. Redirect to dashboard

### Session Management
- Check session on app load
- Use access token for authenticated requests
- Refresh token handled by Supabase

## Data Flow

### Example: Logging a Workout

1. **User Action**: Click "Log Workout" button
2. **Frontend**: Show workout form
3. **User Input**: Fill exercise details
4. **Submit**: POST to `/workouts` with access token
5. **Server**: Verify user, fetch existing workouts
6. **Server**: Append new workout to array
7. **Server**: Save to KV store
8. **Response**: Return success + new workout
9. **Frontend**: Update UI, show success toast
10. **UI Update**: New workout appears in list

## Security Considerations

### Authentication
- Access tokens required for all sensitive operations
- Tokens verified server-side for each request
- Service role key never exposed to frontend

### Data Access
- Users can only access their own data
- Coach access requires explicit assignment
- Parent access requires relationship verification

### Privacy Controls
- Users control visibility (public/private/team-only)
- Media URLs should be signed if using Supabase Storage
- Profile data respects privacy settings

## Performance Optimizations

### Implemented
- Lazy loading with React suspense
- Image optimization with fallbacks
- CSS-in-JS avoided (using Tailwind)
- Minimal re-renders with proper state management

### Future Improvements
- Implement pagination for large lists
- Add infinite scroll for media galleries
- Cache frequently accessed data
- Optimize images with next-gen formats
- Add service worker for offline support
- Implement debouncing for search/filter

## Mobile Considerations

### Responsive Design
- Mobile-first approach
- Hamburger menu for navigation
- Touch-friendly tap targets (min 44px)
- Swipe gestures for carousels
- Bottom navigation for key actions

### PWA Features
- Add manifest.json
- Service worker for offline
- Push notifications for reminders
- Add to home screen prompt

## Testing Strategy

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on all devices
- [ ] Forms submit correctly
- [ ] Data persists after refresh
- [ ] Images load with fallbacks
- [ ] Loading states display
- [ ] Error handling works
- [ ] Authentication flow complete
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Automated Testing (Future)
- Unit tests for components
- Integration tests for API routes
- E2E tests for critical flows
- Performance testing
- Accessibility testing

## Known Limitations

### Current Implementation
1. **KV Store**: Limited querying capabilities
   - Can't filter/sort without loading all data
   - No built-in relationships
   - Consider PostgreSQL for production

2. **Media Storage**: Currently storing URLs only
   - Need to implement Supabase Storage for file uploads
   - Video compression not implemented
   - Large files may cause issues

3. **Real-time Features**: Not implemented
   - Consider Supabase Realtime for notifications
   - Coach feedback needs polling or refresh

4. **Email**: Email confirmation disabled
   - Need to configure email provider
   - Currently auto-confirming users

### Scalability Concerns
- KV store performance with large datasets
- Media storage costs
- API rate limiting not implemented
- No caching layer

## Future Enhancements

### Phase 2 Features
- [ ] Social features (following, commenting)
- [ ] Team messaging
- [ ] Coach-athlete chat
- [ ] Workout templates library
- [ ] Exercise video demonstrations
- [ ] Progress photos comparison
- [ ] Export profile to PDF
- [ ] Mobile app (React Native)

### Phase 3 Features
- [ ] AI coaching recommendations
- [ ] Video analysis with Frame.io
- [ ] Wearable device integration
- [ ] College recruiting tools
- [ ] Event scheduling
- [ ] Team management tools
- [ ] Nutrition barcode scanner
- [ ] Meal plan generator

### Integrations
- [ ] Hudl for video highlights
- [ ] NCSA for recruiting
- [ ] TeamSnap for team management
- [ ] MyFitnessPal for nutrition
- [ ] Apple Health / Google Fit
- [ ] Strava for running/cycling

## Migration Path to Production

### Database
1. **Design PostgreSQL schema** based on KV structure
2. **Create migration scripts** from KV to PostgreSQL
3. **Implement new API** with SQL queries
4. **Test thoroughly** with production data
5. **Migrate users** in batches
6. **Monitor performance** and optimize

### Media Storage
1. **Configure Supabase Storage** buckets
2. **Implement upload flow** with progress
3. **Add image compression** before upload
4. **Implement video processing** pipeline
5. **Generate thumbnails** automatically
6. **Use signed URLs** for private content

### Email Configuration
1. **Choose email provider** (SendGrid, Mailgun)
2. **Configure Supabase Auth** email templates
3. **Enable email confirmation**
4. **Add password reset flow**
5. **Send notifications** for key events

### Monitoring
1. **Add error tracking** (Sentry, LogRocket)
2. **Implement analytics** (Mixpanel, Amplitude)
3. **Monitor performance** (Lighthouse, Web Vitals)
4. **Track user behavior** for optimization
5. **Set up alerts** for critical issues

## Development Workflow

### Local Development
1. Make changes to components
2. Test in browser
3. Check mobile responsive
4. Verify API calls work
5. Test authentication flow

### Deployment
- Automatic deployment via Figma Make
- Changes to server require redeployment
- Test server routes with Postman/curl

### Debugging
- Use browser DevTools
- Check Network tab for API calls
- Review Console for errors
- Test with different user types
- Use Supabase dashboard for data inspection

## Code Style Guidelines

### React Components
- Use functional components with hooks
- Destructure props in function signature
- Keep components focused (single responsibility)
- Extract reusable logic to custom hooks
- Use TypeScript for prop types

### Naming Conventions
- **Components**: PascalCase (e.g., `DashboardHome`)
- **Files**: PascalCase for components, kebab-case for utils
- **Props**: camelCase
- **Functions**: camelCase with verb prefix (e.g., `handleClick`)
- **Constants**: UPPER_SNAKE_CASE

### File Organization
- One component per file
- Group related components in folders
- Keep utilities separate from components
- Co-locate styles if component-specific

## Accessibility

### Implemented
- Semantic HTML elements
- Alt text for images
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

### To Implement
- ARIA labels for interactive elements
- Screen reader testing
- Keyboard shortcuts
- Skip to content links
- High contrast mode

## Browser Support

### Target Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Chrome Android (latest)

### Polyfills Needed
- None currently (modern browser features only)

## Environment Variables

### Required
- `SUPABASE_URL` - Provided by system
- `SUPABASE_SERVICE_ROLE_KEY` - Provided by system
- `SUPABASE_ANON_KEY` - Provided by system

### Optional (for future features)
- `FRAME_IO_API_KEY` - Video processing
- `SENDGRID_API_KEY` - Email notifications
- `STRIPE_API_KEY` - Payment processing (premium features)

## Support & Maintenance

### Common Issues

**Issue**: User can't log in
- **Check**: Email confirmed?
- **Check**: Correct password?
- **Solution**: Use password reset flow

**Issue**: Data not saving
- **Check**: User authenticated?
- **Check**: Network errors in console?
- **Solution**: Verify access token, check server logs

**Issue**: Images not loading
- **Check**: Valid URL?
- **Check**: CORS issues?
- **Solution**: Use ImageWithFallback component

### Contact Points
- Check GitHub issues (if open source)
- Review documentation files
- Test with demo account
- Inspect server logs

## Credits

### Design Inspiration
- Nike Training Club - Motivational design language
- Hudl - Athletic video platform
- LinkedIn - Professional profiles
- Strava - Activity tracking

### Libraries Used
- React, Tailwind CSS, Lucide Icons
- Supabase (Auth, Database, Storage)
- Hono (Edge functions)

---

Last Updated: November 7, 2024
Version: 1.0.0
