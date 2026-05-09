import { IdentityState } from '../IdentityData';
import { Preferences, PreferenceCategory } from '../data/preferences';

export interface ExportProps {
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
}

export const generateProfileText = (props: ExportProps): string => {
  const {
    myName, partnerName, myRole, partnerRole,
    meIdentity, partnerIdentity,
    myPreferences, partnerPreferences,
    visibleCategories, bothHavePreferences
  } = props;

  let titleText = 'My Kinky Map';
  if (myName && partnerName) {
    titleText = `${myName} & ${partnerName}'s Kinky Map`;
  } else if (myName) {
    titleText = `${myName}'s Kinky Map`;
  }
  
  let text = `         🗺️ 😈 ${titleText} 😈 🗺️\n\n`;

  const formatIdentity = (name: string, role: string, id: IdentityState, defaultTitle: string) => {
    if (!id.gender && !id.pronouns && !id.orientation && !id.relationship && !role) return "";
    
    const titleName = name ? name.toUpperCase() : defaultTitle.replace("'S IDENTITY", "");
    const title = `${titleName}'S IDENTITY`;
    
    let section = `        ❖ ── ${title} ── ❖\n`;
    if (role) section += `🎭 Role: ${role}\n`;
    if (id.pronouns) section += `🗣️ Pronouns: ${id.pronouns}\n`;
    if (id.gender) section += `👤 Gender: ${id.gender}\n`;
    if (id.orientation) section += `🌈 Orientation: ${id.orientation}\n`;
    if (id.relationship) section += `🔗 Dating: ${id.relationship}\n`;
    return section + `\n`;
  };

  text += formatIdentity(myName, myRole, meIdentity, 'MY IDENTITY');
  text += formatIdentity(partnerName, partnerRole, partnerIdentity, 'PARTNER IDENTITY');

  text += "        ❖ ── KINK PREFERENCES ── ❖\n";

  const getScoreEmoji = (val: number | undefined) => {
    if (val === -2) return "🔴";
    if (val === -1) return "🟠";
    if (val === 1) return "🟡";
    if (val === 2) return "🟢";
    return "⚪"; 
  };

  if (bothHavePreferences) {
    const n1 = myName ? myName.toUpperCase() : "ME";
    const n2 = partnerName ? partnerName.toUpperCase() : "PARTNER";
    const namesLine = `( ${n1} | ${n2} )`;
    
    const padding = Math.max(0, 21 - Math.floor(namesLine.length / 2));
    text += " ".repeat(padding) + namesLine + "\n\n";

    visibleCategories.forEach(category => {
      let hasItems = false;
      let catText = `✦ ${category.name.toUpperCase()} ✦\n`;

      category.items.forEach(item => {
        const val1 = myPreferences[item.key];
        const val2 = partnerPreferences[item.key];
        
        if ((val1 !== undefined && val1 !== 0) || (val2 !== undefined && val2 !== 0)) {
          const e1 = getScoreEmoji(val1);
          const e2 = getScoreEmoji(val2);
          catText += `  ↳ ${e1} | ${e2}  ${item.label}\n`;
          hasItems = true;
        }
      });

      if (hasItems) {
        text += catText + '\n';
      }
    });
  } else {
    text += `\n`;
    visibleCategories.forEach(category => {
      const allHard = category.items.every(item => myPreferences[item.key] === -2);
      if (allHard) return; 

      let catText = `✦ ${category.name.toUpperCase()} ✦\n`;
      let hasItems = false;

      category.items.forEach(item => {
        const val = myPreferences[item.key];
        if (val !== undefined && val !== 0) { 
          const e1 = getScoreEmoji(val);
          catText += `  ↳ ${e1}  ${item.label}\n`;
          hasItems = true;
        }
      });

      if (hasItems) {
        text += catText + '\n';
      }
    });
  }

  return text;
};
