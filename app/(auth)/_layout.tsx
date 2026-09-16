import { theme } from "@/styles/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: theme.colors.light.secondary,
        },

        // Back arrow + header text
        headerTintColor: theme.colors.light.textWhite,

        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
          color: theme.colors.light.textWhite,
        },

        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="signup"
        options={{
          title: "Create Account",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="forget_password"
        options={{
          title: "Forgot Password",
        }}
      />
    </Stack>
  );
}
