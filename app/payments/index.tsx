import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Payment = {
  id: number;
  customer: string;
  order: string;
  amount: number;
  date: string;
  method: string;
};

const payments: Payment[] = [
  {
    id: 1,
    customer: "Junaid",
    order: "ORD-001",
    amount: 1200,
    date: "16 Sep 2026",
    method: "Cash",
  },
  {
    id: 2,
    customer: "Ikram",
    order: "ORD-002",
    amount: 1500,
    date: "15 Sep 2026",
    method: "Cash",
  },
];

export default function PaymentsScreen() {
  const totalReceived = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Payments",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.light.secondaryLight,
          },
          headerTintColor: theme.colors.light.textWhite,
        }}
      />

      <View style={styles.container}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="cash-outline"
              size={28}
              color={theme.colors.light.primary}
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Total Received</Text>

            <Text style={styles.summaryAmount}>
              Rs. {totalReceived.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="receipt-outline"
              size={23}
              color={theme.colors.light.primary}
            />

            <Text style={styles.statValue}>{payments.length}</Text>

            <Text style={styles.statLabel}>Payments</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="wallet-outline"
              size={23}
              color={theme.colors.light.primary}
            />

            <Text style={styles.statValue}>
              Rs. {totalReceived.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>Received</Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Payment History</Text>

          <Text style={styles.paymentCount}>{payments.length} payments</Text>
        </View>

        {/* Payment List */}
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            payments.length === 0 ? styles.emptyList : styles.list
          }
          renderItem={({ item }) => <PaymentCard payment={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="wallet-outline"
                size={55}
                color={theme.colors.light.primary}
              />

              <Text style={styles.emptyTitle}>No Payments Yet</Text>

              <Text style={styles.emptyText}>
                Payments will appear here when you receive money from customers.
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <Pressable style={styles.paymentCard}>
      <View style={styles.paymentIcon}>
        <Ionicons
          name="checkmark-circle-outline"
          size={25}
          color={theme.colors.light.secondaryDark}
        />
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.customerName}>{payment.customer}</Text>

        <Text style={styles.orderText}>{payment.order}</Text>

        <View style={styles.detailsRow}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={theme.colors.light.textLight}
          />

          <Text style={styles.detailText}>{payment.date}</Text>

          <Ionicons
            name="wallet-outline"
            size={13}
            color={theme.colors.light.textLight}
          />

          <Text style={styles.detailText}>{payment.method}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>
          + Rs. {payment.amount.toLocaleString()}
        </Text>

        <Text style={styles.paidText}>Paid</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
    paddingHorizontal: 16,
  },

  summaryCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 18,
    backgroundColor: theme.colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 55,
    height: 55,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.light.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryContent: {
    marginLeft: 15,
  },

  summaryLabel: {
    fontSize: theme.font.size.medium,
    color: theme.colors.light.secondaryLight,
    opacity: 0.75,
  },

  summaryAmount: {
    fontSize: 25,
    fontWeight: "800",
    color: theme.colors.light.secondaryDark,
    marginTop: 3,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: theme.colors.light.textWhite,
    borderRadius: 15,
    padding: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.light.secondaryLight,
    marginTop: 8,
  },

  statLabel: {
    fontSize: 12,
    color: theme.colors.light.textLight,
    marginTop: 2,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.light.secondaryLight,
  },

  paymentCount: {
    fontSize: 12,
    color: theme.colors.light.textLight,
  },

  list: {
    paddingBottom: 25,
  },

  paymentCard: {
    backgroundColor: theme.colors.light.textWhite,
    borderRadius: theme.radius.large,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    elevation: 4,
    borderColor: theme.colors.light.border,
  },

  paymentIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: theme.colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.light.text,
  },

  orderText: {
    fontSize: 12,
    color: theme.colors.light.textLight,
    marginTop: 2,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 4,
  },

  detailText: {
    fontSize: 11,
    color: theme.colors.light.textLight,
    marginRight: 7,
  },

  amountContainer: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.light.success,
  },

  paidText: {
    fontSize: 11,
    color: theme.colors.light.textLight,
    marginTop: 3,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.light.secondaryLight,
    marginTop: 12,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.light.textLight,
    marginTop: 5,
  },
});
