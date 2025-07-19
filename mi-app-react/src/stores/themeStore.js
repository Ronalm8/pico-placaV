import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: false,
  initialized: false, 
  toggleTheme: () => set((state) => ({
    isDarkMode: !state.isDarkMode,
  })),

  setDarkMode: (value) => set({ isDarkMode: value }),

  setInitialized: () => set({ initialized: true }),
}));


export default useThemeStore;
