import { useTheme } from "@/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import {
  getLatestMeasurement,
  MeasurementRecord,
} from "@/sqliteDB/measurement";
import { addOrder, getNextOrderCode } from "@/sqliteDB/order";
import { getServices, Service } from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import { Spacer15 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import InputField from "./inputField";
import MeasurementPreview from "./MeasurementPreview";

interface NewOrderModalProps {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
}

const NewOrderModal = ({ visible, customer, onClose }: NewOrderModalProps) => {
  const { colors } = useTheme();

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [showservice, setShowServices] = useState(false);
  const [LatestMeasurements, setLatestMeasurements] =
    useState<MeasurementRecord | null>(null);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [amount, setAmount] = useState("");
  const [advance, setAdvance] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible || !customer) return;

    const loadData = async () => {
      try {
        setLoadingMeasurements(true);

        const data = await getServices();
        setServices(data);

        const loadMeasurements = await getLatestMeasurement(customer.id);

        console.log("Latest measurements", loadMeasurements);
        setLatestMeasurements(loadMeasurements);
      } catch (error) {
        console.log("Failed to load orders:", error);
      } finally {
        setLoadingMeasurements(false);
      }
    };

    loadData();
  }, [visible, customer]);

  const loadLatestMeasuremnets = useCallback(async () => {
    if (!customer) return;

    try {
      setLoadingMeasurements(true);

      const measurement = await getLatestMeasurement(customer.id);
      console.log("Latest measurments loaded", measurement);

      setLatestMeasurements(measurement);
    } catch (error) {
      console.log("Failed to load latest measuremnts", error);
    } finally {
      setLoadingMeasurements(false);
    }
  }, [customer]);

  useFocusEffect(
    useCallback(() => {
      if (!visible || !customer) return;

      loadLatestMeasuremnets();
    }, [visible, customer, loadLatestMeasuremnets]),
  );

  const handlePlaceOrder = async () => {
    try {
      if (!customer) return;

      if (!serviceId) {
        console.log("Please select a service");
        return;
      }

      const orderCode = await getNextOrderCode();

      await addOrder(
        orderCode,
        customer.id,
        serviceId,
        LatestMeasurements?.id ?? null,
        Number(amount) || 0,
        deliveryDate.toISOString(),
      );
      console.log("Order created successfully:", orderCode);

      onClose();
    } catch (error) {
      console.log("Failed to create order:", error);
    }
  };

  if (!customer) return null;

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>New Order</Text>

              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.customerSection}>
              <Text style={styles.customerName}>{customer.first_name}</Text>
              <Text style={styles.phone}>{customer.phone}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service</Text>

              <Pressable
                style={styles.options}
                onPress={() => setShowServices(!showservice)}
              >
                <Text style={styles.text}>
                  {serviceId
                    ? services.find((service) => service.id === serviceId)?.name
                    : "Select Service"}
                </Text>

                <Ionicons
                  name={showservice ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.secondaryLight}
                />
              </Pressable>
              {showservice && (
                <View style={styles.list}>
                  {services.map((service) => (
                    <Pressable
                      key={service.id}
                      style={styles.serviceItem}
                      onPress={() => {
                        setServiceId(service.id);
                        setShowServices(false);
                      }}
                    >
                      <Text style={styles.serviceItemText}>{service.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Measurement</Text>

                <Pressable
                  onPress={() => {
                    if (!LatestMeasurements) return;

                    router.push({
                      pathname: "/measurement/new",
                      params: {
                        mode: "edit",
                        customerId: customer.id.toString(),
                        measurementId: LatestMeasurements.id.toString(),
                      },
                    });
                  }}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>

              <View style={styles.measurementBox}>
                {loadingMeasurements ? (
                  <Text style={styles.placeholder}>
                    Loading measurements.....
                  </Text>
                ) : LatestMeasurements ? (
                  <MeasurementPreview
                    measurements={LatestMeasurements.measurements}
                    unit={LatestMeasurements.unit}
                    serviceName={
                      services.find((service) => service.id === serviceId)?.name
                    }
                  />
                ) : (
                  <Text style={styles.placeholder}>no measurements found.</Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Date</Text>

              <Pressable
                style={styles.selectBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.selectText}>
                  {deliveryDate.toLocaleDateString()}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.light.textSecondary}
                />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={deliveryDate}
                  mode="date"
                  display="default"
                  onValueChange={(event, selectedDate) => {
                    setShowDatePicker(false);

                    if (selectedDate) {
                      setDeliveryDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
            <Spacer15 />
            <InputField
              label="Amount"
              placeholder="Enter total amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <InputField
              label="Advance"
              placeholder="Enter advance amount"
              value={advance}
              onChangeText={setAdvance}
              keyboardType="numeric"
            />

            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.placeOrderText}>Place Order</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NewOrderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: theme.colors.light.textWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.light.text,
  },
  customerSection: {
    backgroundColor: theme.colors.light.background,
    borderRadius: 12,
    padding: 15,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.light.text,
  },

  phone: {
    marginTop: 4,
    color: theme.colors.light.textSecondary,
  },
  section: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.light.text,
  },

  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.light.secondaryDark,
  },

  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    color: theme.colors.light.textSecondary,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {},
  placeholder: {},
  measurementBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme.colors.light.background,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "600",
    color: theme.colors.light.text,
  },

  placeOrderButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.light.primary,
    alignItems: "center",
  },

  placeOrderText: {
    fontWeight: "700",
    color: theme.colors.light.secondaryDark,
  },
  list: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: 10,
    backgroundColor: theme.colors.light.textWhite,
    overflow: "hidden",
  },

  serviceItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
  },

  serviceItemText: {
    fontSize: 15,
    color: theme.colors.light.text,
  },
});
