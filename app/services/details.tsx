import { useTheme } from "@/app/context/ThemeContext";
import {
  getAllServices,
  getServiceOrderCount,
  Service,
  toggleServiceStatus,
} from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "all" | "active" | "inactive";

type ServiceWithCount = Service & {
  orderCount: number;
};

const ServicesDetails = () => {
  const { colors } = useTheme();

  const [services, setServices] = useState<ServiceWithCount[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      setLoading(true);

      const data = await getAllServices();

      const servicesWithCounts = await Promise.all(
        data.map(async (service) => {
          const orderCount = await getServiceOrderCount(service.id);

          return {
            ...service,
            orderCount,
          };
        }),
      );

      setServices(servicesWithCounts);
    } catch (error) {
      console.log("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && service.is_active === 1) ||
        (filter === "inactive" && service.is_active === 0);

      return matchesSearch && matchesFilter;
    });
  }, [services, search, filter]);

  const activeCount = services.filter(
    (service) => service.is_active === 1,
  ).length;

  const inactiveCount = services.filter(
    (service) => service.is_active === 0,
  ).length;

  const renderService = ({ item }: { item: ServiceWithCount }) => {
    const isActive = item.is_active === 1;

    return (
      <Pressable
        onPress={() => {
          console.log("Selected service:", item);
        }}
        style={({ pressed }) => [
          styles.serviceCard,
          {
            backgroundColor: colors.card,
          },
          pressed && {
            opacity: 0.8,
            transform: [{ scale: 0.98 }],
          },
        ]}
      >
        <View style={styles.serviceTopRow}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.secondaryLight,
              },
            ]}
          >
            <Ionicons
              name={(item.icon || "shirt-outline") as any}
              size={28}
              color={colors.primary}
            />
          </View>

          <Pressable
            onPress={() => {
              Alert.alert(item.name, "What would you like to do?", [
                {
                  text: "View Orders",
                  onPress: () => {
                    router.push({
                      pathname: "/services/orders",
                      params: {
                        serviceId: item.id.toString(),
                        serviceName: item.name,
                      },
                    });
                  },
                },
                {
                  text: "Edit Service",
                  onPress: () => {
                    router.push({
                      pathname: "/services/edit",
                      params: {
                        serviceId: item.id.toString(),
                      },
                    });
                  },
                },
                {
                  text: item.is_active === 1 ? "Deactivate" : "Activate",
                  onPress: async () => {
                    try {
                      await toggleServiceStatus(
                        item.id,
                        item.is_active === 1 ? 0 : 1,
                      );

                      await loadServices();
                    } catch (error) {
                      console.log("Failed to update service status:", error);
                    }
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]);
            }}
            hitSlop={10}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <Text
          style={[
            styles.serviceName,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.orderCount,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {item.orderCount} {item.orderCount === 1 ? "order" : "orders"}
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isActive ? "#22C55E" : "#9CA3AF",
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {isActive ? "Active" : "Inactive"}
          </Text>
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
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Services
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Manage your tailoring services
          </Text>
        </View>

        <Pressable
          onPress={() => {
            router.push("/services/add");
          }}
          style={[
            styles.addButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Ionicons name="add" size={26} color={colors.secondaryDark} />
        </Pressable>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryValue,
              {
                color: colors.text,
              },
            ]}
          >
            {services.length}
          </Text>

          <Text
            style={[
              styles.summaryLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Total
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryValue,
              {
                color: "#22C55E",
              },
            ]}
          >
            {activeCount}
          </Text>

          <Text
            style={[
              styles.summaryLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Active
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryValue,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {inactiveCount}
          </Text>

          <Text
            style={[
              styles.summaryLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Inactive
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
          size={21}
          color={colors.textSecondary}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search services..."
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
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["all", "active", "inactive"] as Filter[]).map((item) => {
          const selected = filter === item;

          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
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
                {item === "all"
                  ? "All"
                  : item === "active"
                    ? "Active"
                    : "Inactive"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Services */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderService}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="shirt-outline"
                size={48}
                color={colors.textSecondary}
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                No services found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Try another search or add a new service.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ServicesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  summaryCard: {
    flex: 1,
    borderRadius: theme.radius.large,
    paddingVertical: 13,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
  },

  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  searchContainer: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 9,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  serviceCard: {
    width: "48.5%",
    minHeight: 165,
    borderRadius: theme.radius.large,
    padding: 14,
    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  serviceTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },

  orderCount: {
    fontSize: 12,
    marginTop: 4,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
  },

  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },
});
