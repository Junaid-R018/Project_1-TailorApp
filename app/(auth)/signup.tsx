import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import { Spacer10, Spacer30 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
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

const SignUp = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ title: "SignUp" }} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
          />
          <InputField
            style={styles.input}
            label="Last Name"
            placeholder="Enter your last name"
          />
          <InputField
            style={styles.input}
            label="Phone"
            placeholder="Enter phone number"
            keyboardType="numeric"
          />
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

                if (text !== password) {
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
          {/* <InputField
            style={styles.input}
            label="Password"
            placeholder="Enter Password"
            secureTextEntry={true}
          />
          <InputField
            style={styles.input}
            label="Confirm Password"
            placeholder="Re-enter Password"
            secureTextEntry={true}
          /> */}
          <Spacer10 />
          <View style={styles.checkBoxView}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? "#D4AF37" : "#666666"}
            />
            <Text style={styles.checkBoxText}>
              I agree to the{" "}
              <Text style={styles.linkText}>Terms and Conditions.</Text>
            </Text>
          </View>
        </View>
        <MainButton
          title="Sign Up"
          onPress={() => console.log("User created")}
          loading={false}
        />
        <Spacer10 />
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/(auth)/login")}
          >
            logIn
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
    // marginHorizontal: 10,
  },
  input: {
    marginBottom: 15,
  },
  form: {
    width: "100%",
    paddingHorizontal: 0,
  },
  heading: {
    // backgroundColor: "lightblue",
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
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 30,
  },
  errorText: {
    color: theme.color.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  checkBoxView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 0,
    left: 5,
  },
  checkBoxText: {
    fontSize: theme.font.size.small,
    fontWeight: theme.font.weight.regular,
    color: theme.color.secondaryLight,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 80, // moves heading down
    paddingBottom: 30,
  },
});
