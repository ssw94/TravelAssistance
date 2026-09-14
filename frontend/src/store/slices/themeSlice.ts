import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
}

const getInitialMode = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('travel_theme_mode');
  return saved === 'dark' || saved === 'light' ? saved : 'light';
};

const initialState: ThemeState = {
  mode: getInitialMode(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('travel_theme_mode', state.mode);
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('travel_theme_mode', state.mode);
    },
  },
});

export const { toggleTheme, setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
