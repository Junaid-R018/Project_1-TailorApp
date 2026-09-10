import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);

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
              <Pressable onPress={() => setModalVisible(true)}>
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
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setModalVisible(false)}
              >
                <Pressable style={styles.bottomSheet}>
                  <Text style={styles.modalTitle}>Edit Details</Text>
                  <Pressable
                    style={styles.editButton}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/(tabs)/measurements");
                    }}
                  >
                    <Text style={styles.buttonText}>Edit Measurements</Text>
                    <Ionicons
                      name="create-outline"
                      size={22}
                      color={theme.color.text}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.new_measurements}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/(tabs)/measurements");
                    }}
                  >
                    <Text style={styles.buttonText}>New Measurements</Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={theme.color.text}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.all_order}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("../orders");
                    }}
                  >
                    <Text style={styles.buttonText}>All Orders</Text>
                    <Ionicons
                      name="receipt-outline"
                      size={22}
                      color={theme.color.text}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.del_Button}
                    onPress={() => {
                      setModalVisible(false);
                      // router.push("/(tabs)/measurements");
                    }}
                  >
                    <Text style={styles.deletebutton}>Delete Customer</Text>

                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color={theme.color.error}
                    />
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: theme.color.backgroundLight,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    textAlign: "center",
    color: theme.color.text,
    marginBottom: 20,
  },
  editButton: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  new_measurements: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  all_order: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  del_Button: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  buttonText: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: "600",
  },
  deletebutton: {
    color: theme.color.error,
    fontSize: 16,
    fontWeight: "600",
  },
});
