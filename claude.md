# Grit - Athlete Performance Dashboard Project

## Project Overview
An athlete dashboard application that enables student athletes to create public profiles, share their stories, and receive a "Grit Score" based on their efforts and achieved goals.

## Core Features

### Athlete Features
- **Public Profile System**: Athletes can create and maintain public profiles
- **Grit Score**: Performance metric based on efforts and goal achievements
- **Goal Setting**: Physical, nutritional, and mental goal tracking
- **Sport & Position Selection**: During onboarding, users select their sports and positions
- **Personalized Training Plans**: AI-generated training tailored to:
  - Current physical condition and stats
  - Nutrition and mental goals
  - Specific sport and position requirements
- **Position-Specific Drills**: Access to specialized training exercises
- **Journaling**: Track efforts, progress, and challenges
- **Film Review**: Upload game and training footage for ex-pro athlete feedback
- **AI Coach Bot**: Interactive chat for position-specific courses and sport IQ development

### Coach Features
- **Playbook Management**: Upload and manage team playbooks
- **Sport IQ Integration**: Automated teaching based on uploaded plays
- **Athlete Monitoring**: View general Grit Scores and progress for school athletes

### Parent Features
- **Progress Tracking**: Monitor child's development
- **Educational Access**: Learn about position-specific drills and training

## Business Model
- **Free Tier**: Basic training plans
- **Premium Subscription**: Advanced features and progress tracking

## Technical Architecture
- Built using the existing structure in `Athlete Performance Dashboard Design/`
- Vite + TypeScript setup
- Component-based architecture (src/ directory)

## Development Approach
Utilize multiple AI agents for efficient development:
- Claude Code for primary development
- Integration potential with Gemini, Codex, and Grok for specialized tasks

## Next Steps
1. Set up GitHub repository for version control
2. Configure AI agents for specialized tasks
3. Begin implementation based on existing design structure

## Project Files Reference
Located in: `/home/trey/AthleteDashboard/Athlete Performance Dashboard Design/`
- README.md - Original design documentation
- IMPLEMENTATION_GUIDE.md - Development roadmap
- index.html - Entry point
- package.json - Project dependencies
- vite.config.ts - Build configuration
- src/ - Source code directory