import { Box } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { lightTheme } from "../theme/themes/light";
import { darkTheme } from "../theme/themes/dark";
import type { ThemeMode } from "../models/type";
import { useEffect, useState } from "react";
import { ThemeContext } from "./contexts/theme";
import { Switch } from "@mui/material";
import { zIndex } from "../theme/tokens";
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setTheme] = useState<ThemeMode>(() => localStorage.getItem('theme') as ThemeMode || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const theme = currentTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      toggleTheme,
    }}>
    <Switch checked={currentTheme === 'dark'} onChange={toggleTheme} sx={{ position:'fixed', top: '1rem', right: '1rem',zIndex: zIndex.header }} />
    <MuiThemeProvider theme={theme}>
    <Box className="size-full !p-0 !m-0">
      {children}
    </Box>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
