import { initDatabase } from "@/sqliteDB/database";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <Toast />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
