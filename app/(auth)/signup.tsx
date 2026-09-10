import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { saveUser } from "@/Utils/authStorage";
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

const SignUp = () => {
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
      firstName: trimmedFirstName ? "" : "First name is required",
      lastName: trimmedLastName ? "" : "Last name is required",
      phone: trimmedPhone ? "" : "Phone number is required",
      password: !password
        ? "Password is required"
        : password.length < 8
          ? "Password must be at least 8 characters"
          : "",
      confirmPassword: !confirmPassword
        ? "Please confirm your password"
        : password !== confirmPassword
          ? "Passwords do not match"
          : "",
      terms: isChecked ? "" : "You must agree to the Terms and Conditions",
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
        text1: "Invalid input",
        text2:
          Object.values(errors).find(Boolean) ||
          "Please check your information",
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
      await saveUser(user);

      Toast.show({
        type: "success",
        text1: "User Registred Successfully",
        text2: "Use your phone number and password to start.",
      });
      console.log("Sign-up submitted", {
        ...user,
        password: password,
        confirmPassword: confirmPassword,
      });
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1000);
    } catch (error) {
      console.log("Signup error:", error);

      Toast.show({
        type: "error",
        text1: "SignUp Failed",
        text2: "Unable to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Stack.Screen options={{ title: "SignUp" }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={styles.title}>Tanposh</Text>
          <Text style={styles.subtitle}>Register yourself to Continue.</Text>
        </View>
        <Spacer30 />
        <View style={styles.form}>
          <InputField
            style={styles.input}
            label="First Name"
            placeholder="Enter your full name"
            autoComplete="name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (text.trim()) setFirstNameError("");
            }}
          />
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}

          <InputField
            style={styles.input}
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (text.trim()) setLastNameError("");
            }}
          />
          {lastNameError ? (
            <Text style={styles.errorText}>{lastNameError}</Text>
          ) : null}

          <InputField
            style={styles.input}
            label="Phone"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (text.trim()) setPhoneError("");
            }}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
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
              onPress={() => setShowPassword((prev) => !prev)}
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
              onPress={() => setShowConfirmPassword((prev) => !prev)}
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

          <Spacer10 />
          <View style={styles.checkBoxView}>
            <Checkbox
              value={isChecked}
              onValueChange={(value) => {
                setIsChecked(value);
                if (value) setTermsError("");
              }}
              color={isChecked ? theme.color.primary : theme.color.textLight}
            />

            <Text style={styles.checkBoxText}>
              I agree to the{" "}
              <Text style={styles.linkText}>Terms and Conditions.</Text>
            </Text>
          </View>
          {termsError ? (
            <Text style={styles.termsError}>{termsError}</Text>
          ) : null}
        </View>
        <MainButton title="Sign Up" onPress={handleSignUp} loading={loading} />
        <Spacer10 />
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/(auth)/login")}
          >
            Log In
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
    backgroundColor: theme.color.background,
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
    color: theme.color.textGold,
  },

  subtitle: {
    textAlign: "center",
    color: theme.color.secondaryLight,
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
    color: theme.color.error,
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
    color: theme.color.secondaryLight,
  },

  termsError: {
    color: theme.color.error,
    fontSize: 12,
    marginTop: theme.spacing.small,
    marginLeft: 5,
  },

  linkText: {
    fontSize: theme.font.size.small,
    fontWeight: theme.font.weight.semiBold,
    color: theme.color.textGold,
  },
  loginText: {
    textAlign: "center",
    color: theme.color.textLight,
  },
});
