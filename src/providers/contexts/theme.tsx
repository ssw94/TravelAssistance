import { useContext,createContext } from "react";
import type { ThemeMode } from "../../models/type";
interface ThemeContextValue {
  currentTheme: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext as React.Context<ThemeContextValue | undefined>);

  if (!context) {
    throw new Error(
      'useThemeContext must be used within a ThemeProvider'
    );
  }

  return context;
};
