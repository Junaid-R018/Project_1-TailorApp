import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { saveUser } from "@/sqliteDB/auth";
import { theme } from "@/styles/theme";
import { useLoading } from "@/Utils/loading";
import { Spacer10, Spacer30 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Checkbox } from "expo-checkbox";
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

const SignUp = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { loading, setLoading } = useLoading();

  const handleSignUp = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();

    const errors = {
      firstName: trimmedFirstName ? "" : t("firstNameRequired"),

      lastName: trimmedLastName ? "" : t("lastNameRequired"),

      phone: trimmedPhone ? "" : t("phoneRequired"),

      password: !password
        ? t("passwordRequired")
        : password.length < 8
          ? t("passwordMinLength")
          : "",

      confirmPassword: !confirmPassword
        ? t("confirmPasswordRequired")
        : password !== confirmPassword
          ? t("passwordsDoNotMatch")
          : "",

      terms: isChecked ? "" : t("termsRequired"),
    };

    setFirstNameError(errors.firstName);
    setLastNameError(errors.lastName);
    setPhoneError(errors.phone);
    setPasswordError(errors.password);
    setConfirmPasswordError(errors.confirmPassword);
    setTermsError(errors.terms);

    if (Object.values(errors).some(Boolean)) {
      Toast.show({
        type: "error",
        text1: t("invalidInput"),
        text2: Object.values(errors).find(Boolean) || t("checkInformation"),
      });

      return;
    }

    try {
      setLoading(true);

      const user = {
        First_Name: trimmedFirstName,
        Last_Name: trimmedLastName,
        phone: trimmedPhone,
        password,
      };

      // Database logic remains unchanged
      await saveUser(user);

      Toast.show({
        type: "success",
        text1: t("userRegistered"),
        text2: t("usePhonePassword"),
      });

      console.log("User registered:", {
        First_Name: trimmedFirstName,
        Last_Name: trimmedLastName,
        phone: trimmedPhone,
      });

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1000);
    } catch (error) {
      console.log("Signup error:", error);

      Toast.show({
        type: "error",
        text1: t("signupFailed"),
        text2: t("unableCreateAccount"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen
        options={{
          title: t("signup"),
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
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.textGold }]}>
            Tanposh
          </Text>

          <Text style={[styles.subtitle, { color: colors.secondaryLight }]}>
            {t("registerContinue")}
          </Text>
        </View>

        <Spacer30 />

        <View style={styles.form}>
          {/* First Name */}
          <InputField
            style={styles.input}
            label={t("firstName")}
            placeholder={t("enterFirstName")}
            autoComplete="name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);

              if (text.trim()) {
                setFirstNameError("");
              }
            }}
          />

          {firstNameError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {firstNameError}
            </Text>
          ) : null}

          {/* Last Name */}
          <InputField
            style={styles.input}
            label={t("lastName")}
            placeholder={t("enterLastName")}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);

              if (text.trim()) {
                setLastNameError("");
              }
            }}
          />

          {lastNameError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {lastNameError}
            </Text>
          ) : null}

          {/* Phone */}
          <InputField
            style={styles.input}
            label={t("phoneNumber")}
            placeholder={t("enterPhone")}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);

              if (text.trim()) {
                setPhoneError("");
              }
            }}
          />

          {phoneError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {phoneError}
            </Text>
          ) : null}

          {/* Password */}
          <View>
            <InputField
              style={styles.input}
              label={t("password")}
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (text.length > 0 && text.length < 8) {
                  setPasswordError(t("passwordMinLength"));
                } else if (text.length === 0) {
                  setPasswordError("");
                } else {
                  setPasswordError("");
                }

                if (confirmPassword && text !== confirmPassword) {
                  setConfirmPasswordError(t("passwordsDoNotMatch"));
                } else {
                  setConfirmPasswordError("");
                }
              }}
              placeholder={t("enterPassword")}
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
              <Text style={[styles.errorText, { color: colors.error }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View>
            <InputField
              style={styles.input}
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
              <Text style={[styles.errorText, { color: colors.error }]}>
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>

          <Spacer10 />

          {/* Terms */}
          <View style={styles.checkBoxView}>
            <Checkbox
              value={isChecked}
              onValueChange={(value) => {
                setIsChecked(value);

                if (value) {
                  setTermsError("");
                }
              }}
              color={isChecked ? colors.primary : colors.textLight}
            />

            <Text
              style={[styles.checkBoxText, { color: colors.secondaryLight }]}
            >
              {t("agreeToTerms")}{" "}
              <Text style={[styles.linkText, { color: colors.textGold }]}>
                {t("termsAndConditions")}
              </Text>
            </Text>
          </View>

          {termsError ? (
            <Text style={[styles.termsError, { color: colors.error }]}>
              {termsError}
            </Text>
          ) : null}
        </View>

        <MainButton
          title={t("signup")}
          onPress={handleSignUp}
          loading={loading}
        />

        <Spacer10 />

        <Text style={[styles.loginText, { color: colors.textLight }]}>
          {t("alreadyHaveAccount")}{" "}
          <Text
            style={[styles.linkText, { color: colors.textGold }]}
            onPress={() => router.push("/(auth)/login")}
          >
            {t("login")}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },

  heading: {
    marginBottom: 10,
  },

  title: {
    fontSize: theme.font.size.display,
    fontWeight: theme.font.weight.extraBold,
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    fontSize: theme.font.size.small,
    fontWeight: theme.font.weight.regular,
  },

  form: {
    width: "100%",
  },

  input: {
    marginBottom: 15,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 16,
  },

  errorText: {
    fontSize: 12,
    top: -10,
  },

  checkBoxView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 5,
  },

  checkBoxText: {
    flex: 1,
    fontSize: theme.font.size.small,
    fontWeight: theme.font.weight.regular,
  },

  termsError: {
    fontSize: 12,
    marginTop: theme.spacing.small,
    marginLeft: 5,
  },

  linkText: {
    fontSize: theme.font.size.small,
    fontWeight: theme.font.weight.semiBold,
  },

  loginText: {
    textAlign: "center",
  },
});
