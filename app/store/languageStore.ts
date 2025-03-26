// store/languageStore.ts
import {create} from 'zustand';

interface LanguageState {
  language: string;
  setLanguage: (newLanguage: string) => void;
}

const useLanguageStore = create<LanguageState>()((set) => ({
  language: 'ENG',
  setLanguage: (newLanguage: string) => set({ language: newLanguage }),
}));

export default useLanguageStore;