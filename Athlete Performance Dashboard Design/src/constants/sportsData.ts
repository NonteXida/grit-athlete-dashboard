// Predefined sports and their positions
export const SPORTS_DATA = {
  'Football': [
    'Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Lineman',
    'Defensive Lineman', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'
  ],
  'Basketball': [
    'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'
  ],
  'Baseball': [
    'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base',
    'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'
  ],
  'Soccer': [
    'Goalkeeper', 'Center Back', 'Full Back', 'Wing Back', 'Defensive Midfielder',
    'Central Midfielder', 'Attacking Midfielder', 'Winger', 'Striker', 'Forward'
  ],
  'Volleyball': [
    'Setter', 'Outside Hitter', 'Opposite Hitter', 'Middle Blocker', 'Libero', 'Defensive Specialist'
  ],
  'Track & Field': [
    'Sprinter', 'Middle Distance', 'Long Distance', 'Hurdler', 'High Jump',
    'Long Jump', 'Triple Jump', 'Pole Vault', 'Shot Put', 'Discus', 'Javelin', 'Decathlon', 'Heptathlon'
  ],
  'Swimming': [
    'Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley', 'Distance', 'Sprint'
  ],
  'Tennis': ['Singles', 'Doubles'],
  'Wrestling': [
    '106 lbs', '113 lbs', '120 lbs', '126 lbs', '132 lbs', '138 lbs',
    '145 lbs', '152 lbs', '160 lbs', '170 lbs', '182 lbs', '195 lbs', '220 lbs', '285 lbs'
  ],
  'Lacrosse': [
    'Attack', 'Midfield', 'Defense', 'Goalie', 'Face-off Specialist'
  ],
  'Hockey': [
    'Center', 'Left Wing', 'Right Wing', 'Defenseman', 'Goalie'
  ],
  'Softball': [
    'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base',
    'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Player'
  ],
  'Cross Country': ['Distance Runner'],
  'Golf': ['Golfer'],
  'Gymnastics': [
    'All-Around', 'Vault', 'Uneven Bars', 'Balance Beam', 'Floor Exercise',
    'Pommel Horse', 'Still Rings', 'Parallel Bars', 'High Bar'
  ],
  'Cheerleading': ['Base', 'Flyer', 'Tumbler'],
  'Dance': ['Contemporary', 'Ballet', 'Jazz', 'Hip Hop', 'Tap'],
  'Rowing': ['Coxswain', 'Rower'],
  'Other': ['Athlete']
};

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
  { value: 'varsity', label: 'Varsity' },
  { value: 'collegiate', label: 'Collegiate' },
  { value: 'professional', label: 'Professional' }
];

// Get all sports as an array
export const ALL_SPORTS = Object.keys(SPORTS_DATA).sort();

// Get positions for a specific sport
export function getPositionsForSport(sport: string): string[] {
  return SPORTS_DATA[sport as keyof typeof SPORTS_DATA] || [];
}

// Get positions for multiple sports
export function getPositionsForSports(sports: string[]): string[] {
  const positions = sports.flatMap(sport => getPositionsForSport(sport));
  return [...new Set(positions)].sort(); // Remove duplicates and sort
}
