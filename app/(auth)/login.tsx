import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { setLoginStatus } from "@/Utils/authStorage";
import { Spacer15, Spacer20 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowpassword] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(async () => {
      await setLoginStatus(true);

      setLoading(false);
      router.replace("/(auth)/signup");
      // console.log("login succesfull");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Login" }} />
      <Text style={styles.title}>Welcome Back!</Text>
      <InputField
        label="Phone Number"
        value={number}
        onChangeText={setNumber}
        placeholder="+92xxxxxxxx"
        keyboardType="numeric"
      />
      <Spacer15 />
      <View>
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="current-password"
        />
        <Pressable
          style={styles.eyeButton}
          onPress={() => setShowpassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={theme.color.textLight}
          />
        </Pressable>
        <View style={styles.forgetText}>
          <Text style={styles.forgetPassword}>Forget password?</Text>
        </View>
      </View>

      <View style={styles.button}>
        <MainButton
          title="Log in"
          loading={loading}
          disabled={loading}
          onPress={handleLogin}
        />
      </View>
      <Spacer20 />
      <Text style={styles.signupText}>
        Don’t have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => router.push("/(auth)/signup")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginTop: "20%",
    flex: 1,
    backgroundColor: theme.color.background,
    padding: theme.spacing.medium,
  },
  title: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: theme.font.size.display,
    fontWeight: theme.font.weight.semiBold,
  },

  button: { marginTop: theme.spacing.xl },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 30,
  },
  signupText: {
    textAlign: "center",
    color: theme.color.textLight,
    marginTop: theme.spacing.small,
  },
  linkText: {
    color: theme.color.primary,
    fontWeight: theme.font.weight.semiBold,
  },
  forgetText: {
    position: "absolute",
    right: 12,
    top: 70,
  },
  forgetPassword: {
    color: theme.color.textSecondary,
  },
});
