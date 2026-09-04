import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { useLoading } from "@/Utils/loading";
import { Spacer20 } from "@/Utils/spacing";
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

const ForgetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { loading, setLoading } = useLoading();

  const handleChangePassword = async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      console.log("Password reset submitted", {
        password: password,
        confirmPassword: confirmPassword,
      });

      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Change password error:", error);
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
      <Stack.Screen options={{ title: "Forget Password" }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Reset Password</Text>
          <View>
            <InputField
              style={styles.input}
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (text.length > 0 && text.length < 8) {
                  setPasswordError("Password must be at least 8 characters");
                } else {
                  setPasswordError("");
                }

                if (confirmPassword && text !== confirmPassword) {
                  setConfirmPasswordError("Passwords do not match");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.color.textLight}
              />
            </Pressable>

            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>
          <View>
            <InputField
              style={styles.input}
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);

                if (!text) {
                  setConfirmPasswordError("Please confirm your password");
                } else if (text !== password) {
                  setConfirmPasswordError("Passwords do not match");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              placeholder="Re-enter password"
              secureTextEntry={!showConfirmPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.color.textLight}
              />
            </Pressable>

            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <View style={styles.button}>
            <MainButton
              title="Save password"
              onPress={handleChangePassword}
              loading={loading}
            />
          </View>
          <Spacer20 />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
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

  input: {
    marginBottom: theme.spacing.small,
  },

  eyeButton: {
    position: "absolute",
    right: 15,
    top: 30,
    padding: 5,
  },

  errorText: {
    color: theme.color.error,
    fontSize: 12,
    marginTop: -5,
    marginBottom: theme.spacing.small,
    marginLeft: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing.medium,
  },
});
