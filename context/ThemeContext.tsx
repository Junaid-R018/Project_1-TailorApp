import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { theme } from "@/styles/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof theme.colors.light | typeof theme.colors.dark;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "tanposh_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);

      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.log("Failed to load theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = themeMode === "light" ? "dark" : "light";

    setThemeMode(newTheme);

    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.log("Failed to save theme:", error);
    }
  };

  const colors = themeMode === "dark" ? theme.colors.dark : theme.colors.light;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark: themeMode === "dark",
        colors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
