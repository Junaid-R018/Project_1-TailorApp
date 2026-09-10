import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { updatePassword } from "@/Utils/authStorage";
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
import Toast from "react-native-toast-message";

const ForgetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { loading, setLoading } = useLoading();

  const handleChangePassword = async () => {
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      Toast.show({
        type: "error",
        text1: "Password is required",
      });
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      Toast.show({
        type: "error",
        text1: "Confirm password is required",
      });
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
        text2: "Invalid phone number or password",
      });
      return;
    }

    try {
      setLoading(true);

      const updated = await updatePassword(password);

      if (!updated) {
        Toast.show({
          type: "error",
          text1: "Password reset failed",
          text2: "User not found. Please try again.",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Password changed successfully",
        text2: "Please login with your new password.",
      });

      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Change password error:", error);

      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Unable to change your password. Please try again.",
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
      <Stack.Screen options={{ title: "Forget Password" }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Reset Password</Text>
          <View style={styles.inputContainer}>
            <InputField
              label="New Password"
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

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 18,
  },
  inputContainer: {
    marginBottom: 15,
  },

  errorText: {
    marginBottom: 8,
    color: theme.color.error,
    fontSize: 12,
    marginLeft: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing.medium,
  },
});
