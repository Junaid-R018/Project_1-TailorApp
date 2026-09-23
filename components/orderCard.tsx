import { useTheme } from "@/app/context/ThemeContext";
import {
  OrderStatus,
  OrderWithCustomer,
  updateOrderStatus,
} from "@/sqliteDB/order";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface OrderCardProps {
  order: OrderWithCustomer;
}

const statuses: OrderStatus[] = [
  "New",
  "Pending",
  "Ready",
  "Delivered",
  "Cancelled",
];

export default function OrderCard({ order }: OrderCardProps) {
  const { colors } = useTheme();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleStatusChange = async (status: OrderStatus) => {
    if (status === order.status) {
      setStatusModalVisible(false);
      return;
    }

    try {
      setUpdating(true);

      await updateOrderStatus(order.id, status);

      setStatusModalVisible(false);

      console.log(`Order ${order.order_code} status changed to ${status}`);

      // Important:
      // The Orders screen should reload its orders after this.
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* CUSTOMER IMAGE */}
        <Image
          source={require("@/assets/images/profile.png")}
          style={styles.customerImage}
        />

        {/* CUSTOMER INFO */}
        <View style={styles.customerInfo}>
          <Text
            style={[styles.customerName, { color: colors.textNavy }]}
            numberOfLines={1}
          >
            {order.customerName || "Unknown Customer"}
          </Text>

          <Text style={[styles.customerId, { color: colors.textSecondary }]}>
            Order: {order.order_code}
          </Text>

          {/* CREATED DATE */}
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />

            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
              Created: {formatDate(order.created_at)}
            </Text>
          </View>

          {/* DELIVERY DATE */}
          <View style={styles.dateRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textSecondary}
            />

            <Text
              style={[styles.deliveryDate, { color: colors.textSecondary }]}
            >
              Delivery: {formatDate(order.delivery_date)}
            </Text>
          </View>
        </View>

        {/* RIGHT SECTION */}
        <View style={styles.rightSection}>
          {/* STATUS BUTTON */}
          <Pressable
            disabled={updating}
            onPress={() => setStatusModalVisible(true)}
          >
            <StatusBadge status={order.status} />

            <View style={styles.changeStatusRow}>
              <Text
                style={[styles.changeStatusText, { color: colors.primary }]}
              >
                Change
              </Text>

              <Ionicons name="chevron-down" size={13} color={colors.primary} />
            </View>
          </Pressable>

          {/* AMOUNT */}
          <Text style={[styles.amount, { color: colors.text }]}>
            Rs. {(order.amount ?? 0).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* STATUS MODAL */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setStatusModalVisible(false)}
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
              Change Order Status
            </Text>

            <Text style={[styles.modalOrder, { color: colors.textSecondary }]}>
              {order.order_code}
            </Text>

            {statuses.map((status) => {
              const selected = status === order.status;

              return (
                <Pressable
                  key={status}
                  disabled={updating}
                  onPress={() => handleStatusChange(status)}
                  style={[
                    styles.statusOption,
                    {
                      borderColor: colors.border,
                    },
                    selected && {
                      borderColor: colors.primary,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <StatusBadge status={status} />

                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            styles.radioInner,
                            {
                              backgroundColor: colors.primary,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}

            <Pressable
              style={[
                styles.cancelButton,
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statusBadge,

        status === "New" && {
          backgroundColor: colors.primary,
        },

        status === "Pending" && {
          backgroundColor: "#dd7119",
        },

        status === "Ready" && {
          backgroundColor: colors.success,
        },

        status === "Delivered" && {
          backgroundColor: colors.secondaryLight,
        },

        status === "Cancelled" && {
          backgroundColor: colors.error,
        },
      ]}
    >
      <Text style={[styles.statusText, { color: colors.textWhite }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.large,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    marginBottom: 10,
  },

  customerImage: {
    width: 70,
    height: 74,
    borderRadius: theme.radius.medium,
    backgroundColor: "#E8E8E8",
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  customerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },

  customerId: {
    fontSize: 12,
    marginBottom: 4,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  orderDate: {
    fontSize: 11,
  },

  deliveryDate: {
    fontSize: 11,
    fontWeight: "600",
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  changeStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  changeStatusText: {
    fontSize: 9,
    fontWeight: "600",
  },

  amount: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  modalOrder: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
  },

  statusOption: {
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  radioContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  cancelButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
