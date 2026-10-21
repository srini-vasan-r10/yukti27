// ─── Color Palette ───────────────────────────────────────────────
export const COLORS = {
  // Primary purples
  deepPurple:    '#0a0015',
  darkPurple:    '#1a0a2e',
  midPurple:     '#2d1b69',
  purple:        '#4a2c8a',
  lightPurple:   '#7b5ea7',
  
  // Golds
  darkGold:      '#8b7335',
  gold:          '#c9a84c',
  brightGold:    '#f0d78c',
  lightGold:     '#ffd700',
  
  // Neutrals
  white:         '#ffffff',
  offWhite:      '#e8e0f0',
  dimWhite:      '#a89cc0',
  
  // Three.js hex
  three: {
    deepPurple:  0x0a0015,
    darkPurple:  0x1a0a2e,
    midPurple:   0x2d1b69,
    purple:      0x4a2c8a,
    gold:        0xc9a84c,
    brightGold:  0xf0d78c,
    lightGold:   0xffd700,
    white:       0xffffff,
    warmWhite:   0xfff5e0,
    black:       0x000000,
  }
}

// ─── Camera Keyframes ───────────────────────────────────────────
// Each scene defines camera start/end positions and look-at targets
export const CAMERA_KEYFRAMES = [
  // Scene 01: Emergence — far away, advancing into the scene
  {
    position:    { start: [0, 2, 60],    end: [0, 1, 28] },
    lookAt:      { start: [0, 0, 0],     end: [0, 0, 0] },
    fov:         { start: 55,            end: 55 },
  },
  // Scene 02: Strategic Nexus — orbit around central structure
  {
    position:    { start: [0, 1, 28],    end: [12, 6, 18] },
    lookAt:      { start: [0, 0, 0],     end: [0, 0, 0] },
    fov:         { start: 55,            end: 50 },
  },
  // Scene 03: Seven Pillars — camera visits each pillar node
  {
    position:    { start: [12, 6, 18],   end: [-8, 4, 16] },
    lookAt:      { start: [0, 0, 0],     end: [0, 0, 0] },
    fov:         { start: 50,            end: 48 },
  },
  // Scene 04: Competition Reveal — detailed spatial composition
  {
    position:    { start: [-8, 4, 16],   end: [5, 8, 22] },
    lookAt:      { start: [0, 0, 0],     end: [0, -1, 0] },
    fov:         { start: 48,            end: 52 },
  },
  // Scene 05: Convergence — pull back to wide view
  {
    position:    { start: [5, 8, 22],    end: [0, 3, 30] },
    lookAt:      { start: [0, -1, 0],    end: [0, 0, 0] },
    fov:         { start: 52,            end: 55 },
  },
  // Scene 06: Final Invitation — composed final view
  {
    position:    { start: [0, 3, 30],    end: [0, 2, 24] },
    lookAt:      { start: [0, 0, 0],     end: [0, 0, 0] },
    fov:         { start: 55,            end: 50 },
  },
]

// ─── Scene Timing ───────────────────────────────────────────────
// Each scene gets equal weight in the scroll timeline
export const SCENE_COUNT = 6
export const SCENE_DURATION = 1 / SCENE_COUNT

// Pin heights (in vh) for each scene section
export const SCENE_HEIGHTS = [500, 600, 700, 600, 400, 400]
export const TOTAL_HEIGHT_VH = SCENE_HEIGHTS.reduce((a, b) => a + b, 0)

// ─── Strategic Domains (Competition Areas) ──────────────────────
// Using confirmed management competition domains
export const STRATEGIC_DOMAINS = [
  {
    id: 'marketing',
    title: 'Marketing & Brand Strategy',
    description: 'Navigate market dynamics, craft compelling brand narratives, and design campaigns that reshape industries.',
    icon: '◆',
    position: [8, 3, -2],
    color: 0xc9a84c,
  },
  {
    id: 'finance',
    title: 'Finance & Investment',
    description: 'Master capital allocation, risk assessment, and financial modelling in high-stakes decision environments.',
    icon: '◆',
    position: [-6, 5, -4],
    color: 0xf0d78c,
  },
  {
    id: 'operations',
    title: 'Operations & Supply Chain',
    description: 'Optimise end-to-end value chains, logistics networks, and operational excellence frameworks.',
    icon: '◆',
    position: [4, -4, -3],
    color: 0xc9a84c,
  },
  {
    id: 'analytics',
    title: 'Business Analytics',
    description: 'Transform data into strategic insight through advanced analytics, modelling, and evidence-based decision making.',
    icon: '◆',
    position: [-8, -2, -1],
    color: 0xf0d78c,
  },
  {
    id: 'consulting',
    title: 'Strategy Consulting',
    description: 'Solve complex organisational challenges through structured analysis, stakeholder alignment, and strategic recommendations.',
    icon: '◆',
    position: [7, -1, -5],
    color: 0xc9a84c,
  },
  {
    id: 'hr',
    title: 'Human Resources & Leadership',
    description: 'Shape organisational culture, talent strategies, and leadership development in the modern enterprise.',
    icon: '◆',
    position: [-4, 4, -6],
    color: 0xf0d78c,
  },
]

// ─── Competition Events ─────────────────────────────────────────
export const COMPETITIONS = [
  { name: 'Stratagem',    domain: 'consulting',  tagline: 'The Ultimate Strategy Showdown' },
  { name: 'Markética',    domain: 'marketing',   tagline: 'Where Brands Come Alive' },
  { name: 'FinEdge',      domain: 'finance',     tagline: 'Capital Meets Courage' },
  { name: 'OptiMax',      domain: 'operations',  tagline: 'Efficiency Reimagined' },
  { name: 'DataLens',     domain: 'analytics',   tagline: 'See What Others Miss' },
  { name: 'TalentForge',  domain: 'hr',          tagline: 'Leadership Under Pressure' },
  { name: 'CultureQuest', domain: 'hr',          tagline: 'The Cultural Intelligence Challenge' },
  { name: 'PitchCraft',   domain: 'consulting',  tagline: 'Persuade. Convince. Win.' },
]
