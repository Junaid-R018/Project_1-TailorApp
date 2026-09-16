import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAllOrders, OrderStatus, OrderWithCustomer } from "@/sqliteDB/order";

const statusFilters: ("All" | OrderStatus)[] = [
  "All",
  "New",
  "Pending",
  "Ready",
  "Delivered",
  "Cancelled",
];

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<"All" | OrderStatus>(
    "All",
  );

  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (selectedStatus !== "All") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(query) ||
          order.order_code.toLowerCase().includes(query) ||
          String(order.customer_id).includes(query),
      );
    }

    return result;
  }, [orders, selectedStatus, search]);

  return (
    <SafeAreaView style={styles.main}>
      <Stack.Screen
        options={{
          title: "All Orders",
          headerShown: true,

          headerStyle: {
            backgroundColor: theme.colors.light.secondaryLight,
          },

          headerTitleAlign: "center",

          headerTintColor: theme.colors.light.textWhite,

          headerTitleStyle: {
            color: theme.colors.light.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },

          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => {
                  setSearchVisible((prev) => !prev);
                  setSearch("");
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={theme.colors.light.textWhite}
                />
              </Pressable>
              <Pressable onPress={() => router.push("/customer/add")}>
                <Ionicons
                  name="add"
                  size={28}
                  color={theme.colors.light.textWhite}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {searchVisible && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={21} color="#777" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search customer name or order ID"
              placeholderTextColor="#999"
              style={styles.searchInput}
              autoFocus
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={22} color="red" />
              </Pressable>
            )}
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {statusFilters.map((status) => {
            const active = selectedStatus === status;

            return (
              <Pressable
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[styles.filterButton, active && styles.activeFilter]}
              >
                <Text
                  style={[styles.filterText, active && styles.activeFilterText]}
                >
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.resultText}>
          {search
            ? `${filteredOrders.length} ${
                filteredOrders.length === 1 ? "customer" : "customers"
              } found`
            : `${filteredOrders.length} ${
                filteredOrders.length === 1 ? "order" : "orders"
              }`}
        </Text>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          style={styles.ordersList}
          contentContainerStyle={[
            styles.listContent,
            filteredOrders.length === 0 && styles.emptyListContent,
          ]}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={55} color="#aaa" />

              <Text style={styles.emptyTitle}>
                {loading ? "Loading orders..." : "No orders found"}
              </Text>

              {!loading && (
                <Text style={styles.emptyText}>
                  Try another customer name or ID.
                </Text>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function OrderCard({ order }: { order: OrderWithCustomer }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        console.log("Selected order:", order.id);
      }}
    >
      <Image
        source={require("@/assets/images/dp.png")}
        style={styles.customerImage}
      />

      <View style={styles.customerInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {order.customerName}
        </Text>

        <Text style={styles.customerId}>Order: {order.order_code}</Text>

        <Text style={styles.orderDate}>
          {new Date(order.created_at).toLocaleDateString("en-GB")}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <StatusBadge status={order.status} />

        <Text style={styles.amount}>Rs. {order.amount.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <View
      style={[
        styles.statusBadge,

        status === "New" && styles.newStatus,

        status === "Pending" && styles.pendingStatus,

        status === "Ready" && styles.readyStatus,

        status === "Delivered" && styles.deliveredStatus,

        status === "Cancelled" && styles.cancelledStatus,
      ]}
    >
      <Text
        style={[
          styles.statusText,

          status === "New" && styles.newText,

          status === "Pending" && styles.pendingText,

          status === "Ready" && styles.readyText,

          status === "Delivered" && styles.deliveredText,

          status === "Cancelled" && styles.cancelledText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  searchContainer: {
    height: 48,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.light.textWhite,
    borderWidth: 1,
    elevation: 4,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.round,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.light.text,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 9,
  },
  filterButton: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: theme.radius.xxl,
    backgroundColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilter: {
    backgroundColor: theme.colors.light.primary,
  },
  filterText: {
    fontSize: 13,
    color: theme.colors.light.text,
    fontWeight: "500",
  },
  activeFilterText: {
    color: theme.colors.light.textWhite,
    fontWeight: "600",
  },
  resultText: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: theme.font.size.small,
    color: theme.colors.light.textSecondary,
  },
  ordersList: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 10,
  },
  /* * Only center the empty state. * Actual orders always start directly below * the result text. */ emptyListContent:
    { flexGrow: 1, justifyContent: "center" },
  card: {
    backgroundColor: theme.colors.light.textWhite,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.light.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  customerImage: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.round,
    backgroundColor: "#E8E8E8",
  },
  customerInfo: { flex: 1, marginLeft: 12 },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.light.textNavy,
    marginBottom: 3,
  },
  customerId: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "600" },
  newStatus: { backgroundColor: theme.colors.light.primary },
  newText: { color: theme.colors.light.textWhite },
  pendingStatus: { backgroundColor: "#dd7119" },
  pendingText: { color: theme.colors.light.textWhite },
  readyStatus: { backgroundColor: theme.colors.light.success },
  readyText: { color: theme.colors.light.textWhite },
  deliveredStatus: { backgroundColor: theme.colors.light.secondaryLight },
  deliveredText: { color: theme.colors.light.textWhite },
  cancelledStatus: { backgroundColor: theme.colors.light.error },
  cancelledText: { color: theme.colors.light.textWhite },
  amount: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.light.text,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.light.textNavy,
  },
  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: "#888",
  },
});
