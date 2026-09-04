import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { setLoginStatus, validateUser } from "@/Utils/authStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const [numberError, setNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    const trimmedNumber = number.trim();

    const phoneValidationError = trimmedNumber
      ? ""
      : "Phone number is required";

    const passwordValidationError = !password
      ? "Password is required"
      : password.length < 8
        ? "Password must be at least 8 characters"
        : "";

    setNumberError(phoneValidationError);
    setPasswordError(passwordValidationError);

    if (phoneValidationError || passwordValidationError) {
      Toast.show({
        type: "error",
        text1: "Invalid input",
        text2: phoneValidationError || passwordValidationError,
      });
      return;
    }

    try {
      setLoading(true);

      const isValidUser = await validateUser(trimmedNumber, password);

      if (!isValidUser) {
        setPasswordError("Invalid phone number or password");

        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid phone number or password",
        });
        return;
      }
      await setLoginStatus(true);
      Toast.show({
        type: "success",
        text1: "User successfully Logged in",
        text2: "Welcome Back!",
      });
      console.log("Login successful");

      router.replace("/(auth)/signup");
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Something went wrong, Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ title: "Login" }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back!</Text>

          {/* Phone Number */}
          <InputField
            label="Phone Number"
            value={number}
            onChangeText={(text) => {
              setNumber(text);
              if (text.trim()) setNumberError("");
            }}
            placeholder="+92xxxxxxxx"
            keyboardType="numeric"
          />
          {numberError ? (
            <Text style={styles.fieldError}>{numberError}</Text>
          ) : null}

          {/* Password */}
          <View style={styles.passwordContainer}>
            <InputField
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (text.length > 0 && text.length < 8) {
                  setPasswordError("Password must be at least 8 characters");
                } else {
                  setPasswordError("");
                }
              }}
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

            {/* Error + Forget Password */}
            <View style={styles.passwordFooter}>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : (
                <View />
              )}

              <Pressable onPress={() => router.push("/(auth)/forget_password")}>
                <Text style={styles.forgetPassword}>Forget password?</Text>
              </Pressable>
            </View>
          </View>

          {/* Login Button */}
          <View style={styles.button}>
            <MainButton
              title="Log in"
              loading={loading}
              onPress={handleLogin}
            />
          </View>

          {/* Sign Up */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: theme.spacing.medium,
    paddingTop: 60,
    paddingBottom: theme.spacing.large,
  },

  title: {
    marginBottom: theme.spacing.xl,
    fontSize: theme.font.size.display,
    fontWeight: theme.font.weight.extraBold,
    textAlign: "center",
    color: theme.color.textGold,
  },

  passwordContainer: {
    marginTop: theme.spacing.medium,
  },

  fieldError: {
    color: theme.color.error,
    fontSize: 12,
    marginTop: theme.spacing.small,
    marginLeft: 5,
  },

  eyeButton: {
    position: "absolute",
    right: 15,
    top: 30,
    padding: 5,
  },

  passwordFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
    minHeight: 20,
  },

  errorText: {
    color: theme.color.error,
    fontSize: 12,
    flex: 1,
  },

  forgetPassword: {
    color: theme.color.textSecondary,
    fontSize: 12,
  },

  button: {
    marginTop: theme.spacing.xl,
  },

  signupText: {
    textAlign: "center",
    color: theme.color.textLight,
    marginTop: theme.spacing.large,
  },

  linkText: {
    color: theme.color.primary,
    fontWeight: theme.font.weight.semiBold,
  },
});
