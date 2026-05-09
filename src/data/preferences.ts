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
