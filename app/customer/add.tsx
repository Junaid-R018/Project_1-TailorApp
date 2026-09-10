import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from "@react-native-community/datetimepicker";

const AddCustomer = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen
          options={{
            title: "Add New Customer",
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.color.secondaryLight,
            },
            headerRight: () => (
              <Pressable onPress={() => {}}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={28}
                  color={theme.color.textWhite}
                />
              </Pressable>
            ),
            headerTintColor: theme.color.textWhite,
            headerTitleStyle: {
              color: theme.color.textWhite,
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
          <View style={styles.main}>
            <Text style={styles.title}>Add New Customer</Text>

            <View style={styles.form}>
              <InputField
                label="First Name"
                placeholder="Enter your full name"
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
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}

              <InputField
                label="Phone Number"
                placeholder="Enter phone number"
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
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}

              <InputField
                label="Due Date"
                placeholder="Select date"
                value={date.toLocaleDateString("en-GB")}
                editable={false}
                rightIcon="calendar-outline"
                onRightIconPress={() => setShowPicker(true)}
              />
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDate}
                />
              )}
              <InputField
                label="Advance Amount"
                placeholder="Rs."
                keyboardType="numeric"
                value={advanceAmount}
                onChangeText={setAdvanceAmount}
              />
              <InputField
                containerStyle={{ height: 150 }}
                label="Notes"
                placeholder="type here..."
                textAlignVertical="top"
                multiline={true}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
            <MainButton
              title="Save Customer"
              onPress={() => {}}
              loading={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  scrollContent: {
    padding: 10,
  },

  main: {
    alignItems: "center",
  },

  title: {
    fontSize: theme.font.size.display,
    fontWeight: theme.font.weight.bold,
    color: theme.color.textGold,
    marginBottom: 25,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.color.textNavy,
    marginBottom: 7,
  },

  dateInput: {
    width: "100%",
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: 20,
    elevation: 5,
  },

  dateText: {
    fontSize: 16,
    color: theme.color.textNavy,
  },

  errorText: {
    color: theme.color.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});
