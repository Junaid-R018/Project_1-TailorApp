import InputField from "@/components/inputField";
import { theme } from "@/styles/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ForgetPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "ForgetP Password" }} />
      <View style={styles.form}>
        <Text style={styles.title}>Reset password</Text>
        <InputField
          label="Email address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>
    </View>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  form: { width: "100%" },
  title: {
    marginBottom: theme.spacing.large,
    fontSize: theme.font.size.display,
  },
});
