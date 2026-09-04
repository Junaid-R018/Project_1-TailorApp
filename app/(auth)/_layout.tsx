import { theme } from "@/styles/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: theme.color.secondary,
        },

        // Back arrow + header text
        headerTintColor: theme.color.textWhite,

        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
          color: theme.color.textWhite,
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
