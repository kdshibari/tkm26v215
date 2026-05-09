import { PreferenceCategory as PreferenceCategoryType, Preferences, PreferenceValue } from '@/data/preferences';
import { PreferenceSlider } from './PreferenceSlider';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface Props {
  category: PreferenceCategoryType;
  preferences: Preferences;
  onUpdate: (key: string, value: PreferenceValue) => void;
}

export const PreferenceCategory = ({ category, preferences, onUpdate }: Props) => {
  // Calculate how many items are actively filled out
  const answeredCount = category.items.filter(item => preferences[item.key] !== undefined && preferences[item.key] !== 0).length;
  const totalCount = category.items.length;
  const isComplete = answeredCount === totalCount;

  // Check if every single item in this category is a Hard Limit
  const isAllHardLimit = category.items.length > 0 && category.items.every((item) => preferences[item.key] === -2);

  return (
    <AccordionItem value={category.id} className="border border-white/10 bg-background/50 rounded-xl px-4 mb-3 border-b-0 shadow-sm data-[state=open]:bg-white/5 transition-colors">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center justify-between w-full pr-4">
          <h4 className="font-display font-semibold tracking-wide text-foreground/90 text-sm">
            {category.name}
          </h4>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full transition-colors ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-muted-foreground'}`}>
            {answeredCount} / {totalCount}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-6 space-y-4">
        
        {/* Restored Bulk Limit Button */}
        <button
          onClick={() => {
            const newValue = isAllHardLimit ? 0 : -2;
            category.items.forEach((item) => onUpdate(item.key, newValue));
          }}
          className={`w-full py-2 mb-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm ${
            isAllHardLimit 
              ? "bg-transparent text-muted-foreground border-white/10 hover:bg-white/5" 
              : "bg-[#1a1a20] text-[hsl(0,75%,55%)] border-[hsl(0,75%,55%)]/30 hover:bg-[hsl(0,75%,55%)]/10"
          }`}
        >
          {isAllHardLimit ? "Reset Category Limits" : "Set All To Hard Limit"}
        </button>

        {/* Sliders with grayscale effect when disabled */}
        <div className={`space-y-6 transition-all duration-300 ${isAllHardLimit ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}>
          {category.items.map((item) => (
            <PreferenceSlider
              key={item.key}
              item={item}
              label={item.label}
              value={preferences[item.key] ?? 0}
              onChange={(value) => onUpdate(item.key, value as PreferenceValue)}
            />
          ))}
        </div>

      </AccordionContent>
    </AccordionItem>
  );
};
