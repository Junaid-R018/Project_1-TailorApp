import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { validateUser } from "@/sqliteDB/auth";
import { theme } from "@/styles/theme";
import { setLoginStatus } from "@/Utils/authStorage";
import { Spacer10 } from "@/Utils/spacing";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

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
      : `${t("phoneNumber")} ${t("error")}`;

    const passwordValidationError = !password
      ? `${t("password")} ${t("error")}`
      : password.length < 8
        ? "Password must be at least 8 characters"
        : "";

    setNumberError(phoneValidationError);
    setPasswordError(passwordValidationError);

    if (phoneValidationError || passwordValidationError) {
      Toast.show({
        type: "error",
        text1: t("error"),
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
      await AsyncStorage.setItem("userPhone", trimmedNumber);

      Toast.show({
        type: "success",
        text1: t("success"),
        text2: t("welcome"),
      });

      console.log("Login successful");

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login error:", error);

      Toast.show({
        type: "error",
        text1: t("error"),
        text2: t("somethingWentWrong"),
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
          title: t("login"),

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
            {t("welcome")}
          </Text>

          <Spacer10 />

          <InputField
            label={t("phoneNumber")}
            value={number}
            onChangeText={(text) => {
              setNumber(text);

              if (text.trim()) {
                setNumberError("");
              }
            }}
            placeholder="+92xxxxxxxx"
            keyboardType="numeric"
          />

          {numberError ? (
            <Text
              style={[
                styles.fieldError,
                {
                  color: colors.error,
                },
              ]}
            >
              {numberError}
            </Text>
          ) : null}

          <View style={styles.passwordContainer}>
            <InputField
              label={t("password")}
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (text.length > 0 && text.length < 8) {
                  setPasswordError("Password must be at least 8 characters");
                } else {
                  setPasswordError("");
                }
              }}
              placeholder={t("password")}
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
                color={colors.textSecondary}
              />
            </Pressable>

            <View style={styles.passwordFooter}>
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
              ) : (
                <View />
              )}

              <Pressable onPress={() => router.push("/(auth)/forget_password")}>
                <Text
                  style={[
                    styles.forgetPassword,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {t("forgotPassword")}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.button}>
            <MainButton
              title={t("login")}
              loading={loading}
              onPress={handleLogin}
            />
          </View>
          <Text
            style={[
              styles.signupText,
              {
                color: colors.text,
              },
            ]}
          >
            {t("dontHaveAccount")}
            <Text
              style={[
                styles.linkText,
                {
                  color: colors.primary,
                },
              ]}
              onPress={() => router.push("/(auth)/signup")}
            >
              {t("signup")}
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
  },

  passwordContainer: {
    marginTop: theme.spacing.medium,
  },

  fieldError: {
    fontSize: 12,
    marginLeft: 5,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 18,
  },

  passwordFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  errorText: {
    fontSize: 12,
  },

  forgetPassword: {
    fontSize: 12,
  },

  button: {
    marginTop: theme.spacing.xl,
  },

  signupText: {
    textAlign: "center",
    marginTop: theme.spacing.large,
  },

  linkText: {
    fontWeight: theme.font.weight.semiBold,
  },
});
