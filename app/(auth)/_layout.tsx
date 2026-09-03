import { theme } from "@/styles/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.color.secondary,
        },
        headerTintColor: theme.color.textNavy,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
        },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forget_password" />
    </Stack>
  );
}
