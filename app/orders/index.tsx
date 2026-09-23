import { useTheme } from "@/app/context/ThemeContext";
import OrderCard from "@/components/orderCard";
import { getAllOrders, OrderStatus, OrderWithCustomer } from "@/sqliteDB/order";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statusFilters: ("All" | OrderStatus)[] = [
  "All",
  "New",
  "Pending",
  "Ready",
  "Delivered",
  "Cancelled",
];

export default function OrdersScreen() {
  const { colors } = useTheme();

  const [selectedStatus, setSelectedStatus] = useState<"All" | OrderStatus>(
    "All",
  );

  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((order) => {
        const customerName = order.customerName?.toLowerCase() || "";
        const orderCode = order.order_code?.toLowerCase() || "";
        const customerId = String(order.customer_id);

        return (
          customerName.includes(query) ||
          orderCode.includes(query) ||
          customerId.includes(query)
        );
      });
    }

    return result;
  }, [orders, selectedStatus, search]);

  return (
    <SafeAreaView
      style={[
        styles.main,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: "All Orders",
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },

          headerTitleAlign: "center",

          headerTintColor: colors.textWhite,

          headerTitleStyle: {
            color: colors.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },

          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  setSearchVisible((prev) => !prev);
                  setSearch("");
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={25}
                  color={colors.textWhite}
                />
              </Pressable>

              <Pressable
                hitSlop={10}
                onPress={() => router.push("/customer/add")}
              >
                <Ionicons name="add" size={30} color={colors.textWhite} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            filteredOrders.length === 0 && styles.emptyListContent,
          ]}
          ListHeaderComponent={
            <View style={styles.topSection}>
              {/* SEARCH */}
              {searchVisible && (
                <View
                  style={[
                    styles.searchContainer,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={21}
                    color={colors.textSecondary}
                  />

                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search customer name or order ID"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.searchInput,
                      {
                        color: colors.text,
                      },
                    ]}
                    autoFocus
                    returnKeyType="search"
                  />

                  {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                      <Ionicons
                        name="close-circle"
                        size={21}
                        color={colors.textSecondary}
                      />
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
                      style={[
                        styles.filterButton,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                        active && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          {
                            color: colors.text,
                          },
                          active && {
                            color: colors.textWhite,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.resultRow}>
                <Text
                  style={[
                    styles.resultText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {search.trim()
                    ? `${filteredOrders.length} ${
                        filteredOrders.length === 1 ? "order" : "orders"
                      } found`
                    : `${filteredOrders.length} ${
                        filteredOrders.length === 1 ? "order" : "orders"
                      }`}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <OrderCard order={item} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={42}
                  color={colors.secondaryLight}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {loading ? "Loading orders..." : "No orders found"}
              </Text>

              {!loading && (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {search.trim()
                    ? "Try another customer name or order ID."
                    : selectedStatus !== "All"
                      ? `There are no ${selectedStatus.toLowerCase()} orders.`
                      : "Your orders will appear here."}
                </Text>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  // ---------------- HEADER ----------------

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginRight: 4,
  },

  // ---------------- LIST ----------------

  listContent: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 25,
  },

  orderItem: {
    marginBottom: 12,
  },

  // ---------------- TOP SECTION ----------------

  topSection: {
    marginBottom: 4,
  },

  // ---------------- SEARCH ----------------

  searchContainer: {
    minHeight: 52,
    marginBottom: 12,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,

    borderRadius: theme.radius.round,

    elevation: 3,
  },

  searchInput: {
    flex: 1,

    marginLeft: 10,

    fontSize: 14,
  },

  // ---------------- FILTERS ----------------

  filterContainer: {
    paddingVertical: 4,
    paddingRight: 10,

    gap: 10,
  },

  filterButton: {
    minWidth: 72,
    height: 38,

    paddingHorizontal: 17,

    borderRadius: theme.radius.xxl,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },

  resultRow: {
    marginTop: 14,
    marginBottom: 10,
  },

  resultText: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  emptyIconContainer: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    elevation: 2,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 6,
    fontSize: theme.font.size.small,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",
  },
});
