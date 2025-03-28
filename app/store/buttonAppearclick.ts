// store.ts
import {create} from 'zustand';

interface ProjectStore {
  activeProject: number | null;
  setActiveProject: (index: number) => void;
}

const useStore = create<ProjectStore>()((set) => ({
  activeProject: null,
  setActiveProject: (index: number) => set({ activeProject: index }),
}));

export default useStore;