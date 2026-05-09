export type AppMode = 'curious' | 'advanced' | 'full';

export interface PreferenceItem {
  key: string;
  label: string;
}

export interface PreferenceCategory {
  id: string;
  name: string;
  mode: AppMode; // <-- New property added
  items: PreferenceItem[];
}

// FRESH SCALE: -2 to +2
export const PREFERENCE_LEVELS = [
  { value: -2, label: "Hard Limit", color: "hsl(0, 75%, 55%)" },
  { value: -1, label: "Soft Limit", color: "hsl(28, 100%, 65%)" },
  { value: 0, label: "Neutral", color: "hsl(0, 0%, 50%)" },
  { value: 1, label: "Curious", color: "hsl(140, 60%, 65%)" },
  { value: 2, label: "Yes", color: "hsl(160, 70%, 45%)" },
] as const;

export type PreferenceValue = -2 | -1 | 0 | 1 | 2;

export interface Preferences {
  [key: string]: PreferenceValue;
}
export const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  // --- CURIOUS (Level 1: The Basics) ---
  { id: "oral-vaginal-anal", name: "Oral Vaginal Anal", mode: 'curious', items: [ /*...*/ ] },
  { id: "positions", name: "Positions", mode: 'curious', items: [ /*...*/ ] },
  { id: "toys", name: "Toys", mode: 'curious', items: [ /*...*/ ] },
  { id: "sensory", name: "Sensory", mode: 'curious', items: [ /*...*/ ] },
  { id: "role-playing", name: "Role Playing", mode: 'curious', items: [ /*...*/ ] },
  { id: "photography", name: "Photography", mode: 'curious', items: [ /*...*/ ] },

  // --- ADVANCED (Level 2: Adds Impact, Bondage, Psychology) ---
  { id: "orgasm-control", name: "Orgasm Control", mode: 'advanced', items: [ /*...*/ ] },
  { id: "worship", name: "Worship", mode: 'advanced', items: [ /*...*/ ] },
  { id: "psychological", name: "Psychological", mode: 'advanced', items: [ /*...*/ ] },
  { id: "bondage", name: "Bondage", mode: 'advanced', items: [ /*...*/ ] },
  { id: "gags", name: "Gags", mode: 'advanced', items: [ /*...*/ ] },
  { id: "impact", name: "Impact", mode: 'advanced', items: [ /*...*/ ] },
  { id: "marks", name: "Marks", mode: 'advanced', items: [ /*...*/ ] },
  { id: "sensation-play", name: "Sensation Play", mode: 'advanced', items: [ /*...*/ ] },
  { id: "nipples", name: "Nipples", mode: 'advanced', items: [ /*...*/ ] },
  { id: "grouping", name: "Grouping", mode: 'advanced', items: [ /*...*/ ] },
  { id: "materials", name: "Materials", mode: 'advanced', items: [ /*...*/ ] },

  // --- FULL (Level 3: Edge Play, Medical, Scat, etc.) ---
  { id: "genital-torture", name: "Genital Torture", mode: 'full', items: [ /*...*/ ] },
  { id: "electro", name: "Electro", mode: 'full', items: [ /*...*/ ] },
  { id: "medical-play", name: "Medical Play", mode: 'full', items: [ /*...*/ ] },
  { id: "golden-shower", name: "Golden Shower", mode: 'full', items: [ /*...*/ ] },
  { id: "breath-play", name: "Breath Play", mode: 'full', items: [ /*...*/ ] },
];
