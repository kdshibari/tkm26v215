import { useState, useEffect } from 'react';
// ... keep your other imports here

const STORAGE_KEY = 'kinkymap_save_data';

export const usePreferences = () => {
  // 1. Load saved data before initializing state
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    return null;
  };

  const savedData = loadSavedData();

  // 2. Initialize state with saved data or defaults
  const [myPreferences, setMyPreferences] = useState<Preferences>(savedData?.myPreferences || {});
  const [partnerPreferences, setPartnerPreferences] = useState<Preferences>(savedData?.partnerPreferences || {});
  const [myName, setMyName] = useState(savedData?.myName || '');
  const [partnerName, setPartnerName] = useState(savedData?.partnerName || '');
  const [myRole, setMyRole] = useState(savedData?.myRole || '');
  const [partnerRole, setPartnerRole] = useState(savedData?.partnerRole || '');
  const [meIdentity, setMeIdentity] = useState<IdentityState>(savedData?.meIdentity || defaultIdentity);
  const [partnerIdentity, setPartnerIdentity] = useState<IdentityState>(savedData?.partnerIdentity || defaultIdentity);
  const [isLoading, setIsLoading] = useState(false);

  // 3. Auto save to local storage whenever any state changes
  useEffect(() => {
    const dataToSave = {
      myPreferences, partnerPreferences,
      myName, partnerName,
      myRole, partnerRole,
      meIdentity, partnerIdentity
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [myPreferences, partnerPreferences, myName, partnerName, myRole, partnerRole, meIdentity, partnerIdentity]);


  // 4. Update your resetAll function so it also clears the storage
  const resetAll = () => {
    setMyPreferences({});
    setPartnerPreferences({});
    setMyName('');
    setPartnerName('');
    setMyRole('');
    setPartnerRole('');
    setMeIdentity(defaultIdentity);
    setPartnerIdentity(defaultIdentity);
    localStorage.removeItem(STORAGE_KEY);
  };

const encodeState = (state: StoredState): string => {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(state));
  } catch { return ''; }
};

const decodeState = (encoded: string): StoredState | null => {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch { return null; }
};

// Synchronously pull initial data so it never overwrites with blanks
const getInitialState = (): Partial<StoredState> => {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  
  if (hash && !hash.startsWith('map=')) {
    const decoded = decodeState(hash);
    if (decoded) return decoded;
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }

  return {};
};

export const usePreferences = () => {
  const initialState = getInitialState();

  const [myPreferences, setMyPreferences] = useState<Preferences>(initialState.me || getDefaultPreferences());
  const [partnerPreferences, setPartnerPreferences] = useState<Preferences>(initialState.partner || getDefaultPreferences());
  const [myName, setMyName] = useState(initialState.myName || '');
  const [partnerName, setPartnerName] = useState(initialState.partnerName || '');
  const [myRole, setMyRole] = useState(initialState.myRole || '');
  const [partnerRole, setPartnerRole] = useState(initialState.partnerRole || '');
  
  // Connect identity states to initial stored data
  const [meIdentity, setMeIdentity] = useState<IdentityState>(initialState.meIdentity || defaultIdentity);
  const [partnerIdentity, setPartnerIdentity] = useState<IdentityState>(initialState.partnerIdentity || defaultIdentity);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle Supabase loading (if user came from a shared link)
  useEffect(() => {
    const loadAsyncMap = async () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('map=')) {
        setIsLoading(true);
        const id = hash.split('=')[1];
        const { data, error } = await supabase
          .from('maps')
          .select('data')
          .eq('id', id)
          .single();

        if (data && !error) {
          const decoded = data.data as StoredState;
          setMyPreferences(decoded.me || getDefaultPreferences());
          setPartnerPreferences(decoded.partner || getDefaultPreferences());
          setMyName(decoded.myName || '');
          setPartnerName(decoded.partnerName || '');
          setMyRole(decoded.myRole || '');
          setPartnerRole(decoded.partnerRole || '');
          setMeIdentity(decoded.meIdentity || defaultIdentity);
          setPartnerIdentity(decoded.partnerIdentity || defaultIdentity);
        }
        setIsLoading(false);
      }
      setIsInitialized(true);
    };

    loadAsyncMap();
  }, []);

  // Auto-save to localStorage whenever ANY state changes
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const state: StoredState = {
      me: myPreferences,
      partner: partnerPreferences,
      myName,
      partnerName,
      myRole,
      partnerRole,
      meIdentity,
      partnerIdentity,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [myPreferences, partnerPreferences, myName, partnerName, myRole, partnerRole, meIdentity, partnerIdentity, isInitialized, isLoading]);

  const updateMyPreference = useCallback((key: string, value: PreferenceValue) => {
    setMyPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const updatePartnerPreference = useCallback((key: string, value: PreferenceValue) => {
    setPartnerPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setMyPreferences(getDefaultPreferences());
    setPartnerPreferences(getDefaultPreferences());
    setMyName('');
    setPartnerName('');
    setMyRole('');
    setPartnerRole('');
    setMeIdentity(defaultIdentity);
    setPartnerIdentity(defaultIdentity);
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const getShareableUrl = async () => {
    const state: StoredState = {
      me: myPreferences,
      partner: partnerPreferences,
      myName,
      partnerName,
      myRole,
      partnerRole,
      meIdentity,
      partnerIdentity,
    };

    const shortId = Math.random().toString(36).substring(2, 10);

    const { error } = await supabase
      .from('maps')
      .insert([{ id: shortId, data: state }]);

    if (error) {
      console.error("Supabase error, using long URL fallback", error);
      return `${window.location.origin}${window.location.pathname}#${encodeState(state)}`;
    }

    return `${window.location.origin}${window.location.pathname}#map=${shortId}`;
  };

  return {
    myPreferences,
    partnerPreferences,
    myName,
    partnerName,
    myRole,
    partnerRole,
    setMyName,
    setPartnerName,
    setMyRole,
    setPartnerRole,
    updateMyPreference,
    updatePartnerPreference,
    resetAll,
    getShareableUrl,
    isLoading,
    meIdentity,
    setMeIdentity,
    partnerIdentity,
    setPartnerIdentity,
  };
};
