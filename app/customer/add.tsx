import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import {
  addCustomer,
  getCustomerById,
  updateCustomer,
} from "@/sqliteDB/customer";
import { addOrder } from "@/sqliteDB/order";
import { getServices, Service } from "@/sqliteDB/services";

import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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

const AddCustomer = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [address, setAddress] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // =========================
  // SERVICES
  // =========================
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [serviceError, setServiceError] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [advanceAmount, setAdvanceAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const { customerId, mode } = useLocalSearchParams<{
    customerId?: string;
    mode?: string;
  }>();

  const isEditMode = mode === "edit";

  // =========================
  // LOAD CUSTOMER + SERVICES
  // =========================
  useEffect(() => {
    const loadCustomer = async () => {
      if (!isEditMode || !customerId) return;

      try {
        const customer = await getCustomerById(Number(customerId));

        if (!customer) return;

        setFirstName(customer.first_name || "");
        setPhone(customer.phone || "");
        setAdvanceAmount(customer.advance_amount?.toString() || "");
        setAddress(customer.address || "");
        setNotes(customer.notes || "");

        if (customer.due_date) {
          setDate(new Date(customer.due_date));
        }

        console.log("Customer loaded for editing:", customer);
      } catch (error) {
        console.error("Failed to load customer:", error);
      }
    };

    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(data);

        // Don't automatically select a service.
        // User must choose the service when creating a new order.
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };

    loadCustomer();
    loadServices();
  }, [isEditMode, customerId]);

  // =========================
  // DATE
  // =========================
  const handleDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // =========================
  // SAVE CUSTOMER
  // =========================
  const handleSaveCustomer = async () => {
    let hasError = false;

    // First name validation
    if (!firstName.trim()) {
      setFirstNameError(t("firstNameRequired"));
      hasError = true;
    } else {
      setFirstNameError("");
    }

    // Phone validation
    if (!phone.trim()) {
      setPhoneError(t("phoneRequired"));
      hasError = true;
    } else {
      setPhoneError("");
    }

    // Service is required only for a NEW customer/order
    if (!isEditMode && !selectedServiceId) {
      setServiceError("Please select a service");
      hasError = true;
    } else {
      setServiceError("");
    }

    if (hasError) {
      return;
    }

    try {
      // =========================
      // EDIT CUSTOMER
      // =========================
      if (isEditMode && customerId) {
        await updateCustomer(
          Number(customerId),
          firstName,
          phone,
          date.toISOString(),
          Number(advanceAmount) || 0,
          address,
          notes,
        );

        console.log("Customer updated successfully");

        router.back();
        return;
      }

      // =========================
      // ADD NEW CUSTOMER
      // =========================
      const newCustomerId = await addCustomer(
        firstName,
        phone,
        date.toISOString(),
        Number(advanceAmount) || 0,
        address,
        notes,
      );

      console.log("Customer saved successfully:", newCustomerId);

      const orderCode = `ORD-${String(newCustomerId).padStart(3, "0")}`;

      // Create order with selected service
      await addOrder(
        orderCode,
        newCustomerId,
        selectedServiceId,
        0,
        date.toISOString(),
      );

      console.log(
        "Order created successfully:",
        orderCode,
        "service_id:",
        selectedServiceId,
      );

      router.back();
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          title: isEditMode ? t("editCustomer") : t("addCustomer"),
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
            {isEditMode ? t("editCustomer") : t("addCustomer")}
          </Text>

          <View style={styles.form}>
            {/* =========================
                FIRST NAME
            ========================= */}
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

            {/* =========================
                PHONE
            ========================= */}
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

            {/* =========================
                SERVICE
            ========================= */}
            {!isEditMode && (
              <View style={styles.serviceSection}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Service
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.serviceList}
                >
                  {services.map((service) => {
                    const selected = selectedServiceId === service.id;

                    return (
                      <Pressable
                        key={service.id}
                        onPress={() => {
                          setSelectedServiceId(service.id);
                          setServiceError("");
                        }}
                        style={[
                          styles.serviceChip,
                          {
                            backgroundColor: selected
                              ? colors.secondaryLight
                              : colors.card,
                            borderColor: selected
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            (service.icon ||
                              "shirt-outline") as keyof typeof Ionicons.glyphMap
                          }
                          size={20}
                          color={
                            selected ? colors.primary : colors.textSecondary
                          }
                        />

                        <Text
                          numberOfLines={1}
                          style={{
                            color: selected ? colors.primary : colors.text,
                            fontWeight: selected ? "700" : "500",
                          }}
                        >
                          {service.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {serviceError ? (
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: colors.error,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {serviceError}
                  </Text>
                ) : null}
              </View>
            )}

            {/* =========================
                DUE DATE
            ========================= */}
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

            {/* =========================
                ADVANCE AMOUNT
            ========================= */}
            <InputField
              label={t("advanceAmount")}
              placeholder="Rs."
              keyboardType="numeric"
              value={advanceAmount}
              onChangeText={setAdvanceAmount}
            />

            {/* =========================
                ADDRESS
            ========================= */}
            <InputField
              label={t("Address")}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              multiline={true}
              textAlignVertical="top"
              containerStyle={{ height: 120 }}
            />

            {/* =========================
                NOTES
            ========================= */}
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

          {/* =========================
              BOTTOM SHEET
          ========================= */}
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
                  <Text style={[styles.deleteButton, { color: colors.error }]}>
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
            title={isEditMode ? t("updateCustomer") : t("saveCustomer")}
            onPress={handleSaveCustomer}
            loading={false}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  main: {
    alignItems: "center",
  },

  title: {
    fontSize: theme.font.size.display,
    fontWeight: theme.font.weight.bold,
  },

  form: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
  },

  serviceSection: {
    marginTop: 8,
    marginBottom: 10,
  },

  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  serviceList: {
    gap: 10,
    paddingBottom: 8,
  },

  serviceChip: {
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
