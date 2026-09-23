import { useTheme } from "@/app/context/ThemeContext";
import { getOrdersByService, ServiceOrder } from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusFilter =
  | "All"
  | "New"
  | "Pending"
  | "Ready"
  | "Delivered"
  | "Cancelled";

const statuses: StatusFilter[] = [
  "All",
  "New",
  "Pending",
  "Ready",
  "Delivered",
  "Cancelled",
];

const ServiceOrders = () => {
  const { colors } = useTheme();

  const { serviceId, serviceName } = useLocalSearchParams<{
    serviceId: string;
    serviceName: string;
  }>();

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const data = await getOrdersByService(Number(serviceId));

        setOrders(data);
      } catch (error) {
        console.log("Failed to load service orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [serviceId]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.order_code?.toLowerCase().includes(searchText) ||
        order.customer_name?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const formatDate = (date: string | null) => {
    if (!date) return "No delivery date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "#3B82F6";

      case "Pending":
        return "#F59E0B";

      case "Ready":
        return "#22C55E";

      case "Delivered":
        return "#10B981";

      case "Cancelled":
        return "#EF4444";

      default:
        return colors.textSecondary;
    }
  };

  const renderOrder = ({ item }: { item: ServiceOrder }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <Pressable
        onPress={() => {
          console.log("Selected service order:", item);
        }}
        style={({ pressed }) => [
          styles.orderCard,
          {
            backgroundColor: colors.card,
          },
          pressed && {
            opacity: 0.8,
          },
        ]}
      >
        {/* Top */}
        <View style={styles.orderTop}>
          <View style={styles.orderCodeContainer}>
            <View
              style={[
                styles.orderIcon,
                {
                  backgroundColor: colors.secondaryLight,
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.orderCode,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {item.order_code}
              </Text>

              <Text
                style={[
                  styles.customerName,
                  {
                    color: colors.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {item.customer_name || "Unknown customer"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${statusColor}18`,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: statusColor,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: statusColor,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Bottom */}
        <View
          style={[
            styles.orderBottom,
            {
              borderTopColor: colors.background,
            },
          ]}
        >
          <View style={styles.infoItem}>
            <Ionicons
              name="cash-outline"
              size={17}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.text,
                },
              ]}
            >
              Rs. {Number(item.amount || 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={17}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {formatDate(item.delivery_date)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {serviceName || "Service Orders"}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search order or customer..."
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.searchInput,
            {
              color: colors.text,
            },
          ]}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={19}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {/* Status filters */}
      <FlatList
        horizontal
        data={statuses}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusFilters}
        renderItem={({ item }) => {
          const selected = statusFilter === item;

          return (
            <Pressable
              onPress={() => setStatusFilter(item)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selected ? colors.primary : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: selected
                      ? colors.secondaryDark
                      : colors.textSecondary,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Orders */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor: colors.secondaryLight,
                  },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={38}
                  color={colors.primary}
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
                No orders found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                There are no orders matching this service and filter.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ServiceOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
    marginLeft: 4,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  searchContainer: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 9,
  },

  statusFilters: {
    paddingVertical: 4,
    paddingBottom: 14,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },

  listContent: {
    paddingBottom: 30,
  },

  orderCard: {
    borderRadius: theme.radius.large,
    padding: 14,
    marginBottom: 11,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  orderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  orderCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  orderCode: {
    fontSize: 15,
    fontWeight: "700",
  },

  customerName: {
    fontSize: 12,
    marginTop: 3,
    maxWidth: 140,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  orderBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 13,
    paddingTop: 11,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    fontSize: 12,
    marginLeft: 5,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    minHeight: 350,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
});
