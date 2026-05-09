// src/utils/exportProfile.ts
import { IdentityState } from '../IdentityData';
import { Preferences, PreferenceCategory } from '../data/preferences';

interface ExportProps {
  myName: string;
  partnerName: string;
  myRole: string;
  partnerRole: string;
  meIdentity: IdentityState;
  partnerIdentity: IdentityState;
  myPreferences: Preferences;
  partnerPreferences: Preferences;
  visibleCategories: PreferenceCategory[];
  bothHavePreferences: boolean;
  getShareableUrl: () => Promise<string>;
}

export const generateProfileText = async (props: ExportProps): Promise<string> => {
  // Move all your text += logic here...
  // This makes Index.tsx incredibly clean!
}
