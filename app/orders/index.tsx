// app/orders/index.tsx

import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useMemo, useState } from "react";
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

import { Order, orders, OrderStatus } from "@/Utils/dummyOrders";

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

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(query) ||
          order.customerId.toLowerCase().includes(query),
      );
    }

    return result;
  }, [selectedStatus, search]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Orders",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },
          headerTitleAlign: "center",
          headerTintColor: theme.color.textWhite,
          headerTitleStyle: {
            color: theme.color.textWhite,
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
                  color={theme.color.textWhite}
                />
              </Pressable>

              <Pressable onPress={() => router.push("/customer/add")}>
                <Ionicons name="add" size={28} color={theme.color.textWhite} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {/* SEARCH */}
        {searchVisible && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={21} color="#777" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search customer name or ID"
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
        {/* STATUS FILTERS */}
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

        {/* RESULT */}
        <Text style={styles.resultText}>
          {search
            ? `${filteredOrders.length} customer found`
            : `${filteredOrders.length} orders`}
        </Text>

        {/* ORDERS */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.ordersList}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={55} color="#aaa" />

              <Text style={styles.emptyTitle}>No orders found</Text>

              <Text style={styles.emptyText}>
                Try another customer name or ID.
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        // Order details will be added later
        console.log("Selected order:", order.id);
      }}
    >
      {/* CUSTOMER IMAGE */}
      <Image source={{ uri: order.image }} style={styles.customerImage} />

      {/* CUSTOMER INFO */}
      <View style={styles.customerInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {order.customerName}
        </Text>

        <Text style={styles.customerId}>ID: {order.customerId}</Text>

        <Text style={styles.orderDate}>{order.date}</Text>
      </View>

      {/* RIGHT SIDE */}
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
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  searchContainer: {
    height: 48,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.textWhite,
    borderWidth: 1,
    elevation: 4,
    borderColor: theme.color.border,
    borderRadius: theme.radius.round,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: theme.color.text,
  },

  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 9,
  },

  filterButton: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#E2E2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: theme.color.primary,
  },

  filterText: {
    fontSize: 13,
    color: theme.color.text,
    fontWeight: "500",
  },

  activeFilterText: {
    color: theme.color.textWhite,
    fontWeight: "600",
  },

  resultText: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 13,
    color: theme.color.textSecondary,
  },

  ordersList: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 10,
    flexGrow: 0,
  },

  card: {
    minHeight: 105,
    backgroundColor: theme.color.textWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.color.border,
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

  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.color.textNavy,
    marginBottom: 3,
  },

  customerId: {
    fontSize: 12,
    color: theme.color.textSecondary,
    marginBottom: 4,
  },

  orderDate: {
    fontSize: 12,
    color: theme.color.textSecondary,
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 65,
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

  newStatus: {
    backgroundColor: theme.color.primary,
  },

  newText: {
    color: theme.color.textWhite,
  },

  pendingStatus: {
    backgroundColor: "#dd7119",
  },

  pendingText: {
    color: theme.color.textWhite,
  },

  readyStatus: {
    backgroundColor: theme.color.success,
  },

  readyText: {
    color: theme.color.textWhite,
  },

  deliveredStatus: {
    backgroundColor: "#DCEEFF",
  },

  deliveredText: {
    color: "#2874B2",
  },

  cancelledStatus: {
    backgroundColor: "#FFE0E0",
  },

  cancelledText: {
    color: "#C0392B",
  },

  amount: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: theme.color.text,
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
    color: theme.color.textNavy,
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: "#888",
  },
});
