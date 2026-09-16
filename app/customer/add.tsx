import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { addCustomer } from "@/sqliteDB/customer";
import { addOrder } from "@/sqliteDB/order";

import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const AddCustomer = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

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

  const handleSaveCustomer = async () => {
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError(t("firstNameRequired"));
      hasError = true;
    } else {
      setFirstNameError("");
    }

    if (!phone.trim()) {
      setPhoneError(t("phoneRequired"));
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (hasError) {
      return;
    }

    try {
      const customerId = await addCustomer(
        firstName,
        phone,
        date.toISOString(),
        Number(advanceAmount) || 0,
        notes,
      );

      console.log("Customer saved successfully:", customerId);

      const orderCode = `ORD-${String(customerId).padStart(3, "0")}`;

      await addOrder(orderCode, customerId, null, 0, date.toISOString());

      console.log("Order created successfully:", orderCode);

      router.back();
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen
          options={{
            title: t("addCustomer"),
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.secondaryLight,
            },
            headerRight: () => (
              <Pressable onPress={() => setModalVisible(true)}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={28}
                  color={colors.textWhite}
                />
              </Pressable>
            ),
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
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.main}>
            <Text style={[styles.title, { color: colors.textGold }]}>
              {t("addCustomer")}
            </Text>

            <View style={styles.form}>
              <InputField
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

              <InputField
                label={t("phone")}
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

              <InputField
                label={t("dueDate")}
                placeholder={t("selectDate")}
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
                label={t("advanceAmount")}
                placeholder="Rs."
                keyboardType="numeric"
                value={advanceAmount}
                onChangeText={setAdvanceAmount}
              />

              <InputField
                containerStyle={{ height: 150 }}
                label={t("notes")}
                placeholder={t("typeHere")}
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
                <Pressable
                  style={[
                    styles.bottomSheet,
                    {
                      backgroundColor: colors.backgroundLight,
                    },
                  ]}
                  onPress={(event) => event.stopPropagation()}
                >
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {t("editDetails")}
                  </Text>

                  <Pressable
                    style={[
                      styles.modalButton,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/(tabs)/measurements");
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                      {t("editMeasurement")}
                    </Text>

                    <Ionicons
                      name="create-outline"
                      size={22}
                      color={colors.text}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.modalButton,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/(tabs)/measurements");
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                      {t("newMeasurement")}
                    </Text>

                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={colors.text}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.modalButton,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("../orders");
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                      {t("allOrders")}
                    </Text>

                    <Ionicons
                      name="receipt-outline"
                      size={22}
                      color={colors.text}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.modalButton,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.deleteButton, { color: colors.error }]}
                    >
                      {t("deleteCustomer")}
                    </Text>

                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color={colors.error}
                    />
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>

            <MainButton
              title={t("saveCustomer")}
              onPress={handleSaveCustomer}
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
    marginBottom: 25,
  },

  form: {
    width: "100%",
  },

  errorText: {
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
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  modalTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  modalButton: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    fontSize: 16,
    fontWeight: "600",
  },
});
