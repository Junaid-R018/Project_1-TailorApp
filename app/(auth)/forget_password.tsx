import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { updatePassword } from "@/sqliteDB/auth";
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
import Toast from "react-native-toast-message";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const ForgetPasswordScreen = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

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
      setPasswordError(t("passwordRequired"));

      Toast.show({
        type: "error",
        text1: t("passwordRequired"),
      });

      return;
    }

    if (password.length < 8) {
      setPasswordError(t("passwordMinLength"));
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t("confirmPasswordRequired"));

      Toast.show({
        type: "error",
        text1: t("confirmPasswordRequiredToast"),
      });

      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t("passwordsDoNotMatch"));

      Toast.show({
        type: "error",
        text1: t("somethingWentWrong"),
        text2: t("passwordsDoNotMatch"),
      });

      return;
    }

    try {
      setLoading(true);

      // Database logic remains unchanged
      const updated = await updatePassword(password, confirmPassword);

      if (!updated) {
        Toast.show({
          type: "error",
          text1: t("passwordResetFailed"),
          text2: t("userNotFound"),
        });

        return;
      }

      Toast.show({
        type: "success",
        text1: t("passwordChangedSuccessfully"),
        text2: t("loginWithNewPassword"),
      });

      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Change password error:", error);

      Toast.show({
        type: "error",
        text1: t("somethingWentWrong"),
        text2: t("unableChangePassword"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          title: t("resetPassword"),
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },

          headerTintColor: colors.textWhite,

          headerTitleStyle: {
            color: colors.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },

          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textGold,
              },
            ]}
          >
            {t("resetPassword")}
          </Text>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <InputField
              label={t("newPassword")}
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (text.length > 0 && text.length < 8) {
                  setPasswordError(t("passwordMinLength"));
                } else {
                  setPasswordError("");
                }

                if (confirmPassword && text !== confirmPassword) {
                  setConfirmPasswordError(t("passwordsDoNotMatch"));
                } else {
                  setConfirmPasswordError("");
                }
              }}
              placeholder={t("enterYourPassword")}
              secureTextEntry={!showPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.textLight}
              />
            </Pressable>

            {passwordError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.error,
                  },
                ]}
              >
                {passwordError}
              </Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View>
            <InputField
              label={t("confirmPassword")}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);

                if (!text) {
                  setConfirmPasswordError(t("confirmPasswordRequired"));
                } else if (text !== password) {
                  setConfirmPasswordError(t("passwordsDoNotMatch"));
                } else {
                  setConfirmPasswordError("");
                }
              }}
              placeholder={t("reenterPassword")}
              secureTextEntry={!showConfirmPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.textLight}
              />
            </Pressable>

            {confirmPasswordError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.error,
                  },
                ]}
              >
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>

          <View style={styles.button}>
            <MainButton
              title={t("savePassword")}
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
