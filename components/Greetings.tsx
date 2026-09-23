import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { getUser } from "@/sqliteDB/auth";
import { OrderWithCustomer, searchOrders } from "@/sqliteDB/order";
import {
  getServiceOrderCount,
  getServices,
  Service,
} from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import { Spacer15 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import OrderCard from "./orderCard";
import ServiceCard from "./ServiceCard";

type GreetingsProps = {
  orders: OrderWithCustomer[];
};

const Greetings = ({ orders }: GreetingsProps) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OrderWithCustomer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceOrderCounts, setServiceOrderCounts] = useState<
    Record<number, number>
  >({});
  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    try {
      const data = await getUser();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.log("Failed to load user", error);
    }
  };

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);

      const counts: Record<number, number> = {};

      await Promise.all(
        data.map(async (service) => {
          counts[service.id] = await getServiceOrderCount(service.id);
        }),
      );

      setServiceOrderCounts(counts);
    } catch (error) {
      console.log("Failed to load services", error);
    }
  };

  useEffect(() => {
    loadServices();
    loadUser();
  }, []);

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12
      ? t("goodMorning")
      : hour < 17
        ? t("goodAfternoon")
        : t("goodEvening");

  const day = now.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchOrders(text);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.secondaryLight,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text
              style={[
                styles.greetingText,
                {
                  color: colors.textGold,
                },
              ]}
            >
              {greeting}
            </Text>

            <Text
              style={[
                styles.greetingText2,
                {
                  color: colors.textGold,
                },
              ]}
            >
              {day}, {date}
            </Text>
          </View>

          <Pressable
            style={styles.notification}
            onPress={() => router.push("/Notifications")}
          >
            <Ionicons name="notifications" size={24} color={colors.textGold} />
          </Pressable>
        </View>

        <Spacer15 />

        {/* Search Wrapper */}
        <View style={styles.searchWrapper}>
          {/* Search Box */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors.backgroundLight,
                borderColor:
                  searchQuery.length > 0 ? colors.textGold : "transparent",
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={
                searchQuery.length > 0 ? colors.textGold : colors.textSecondary
              }
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              placeholder={t("searchHere")}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            )}
          </View>

          {/* Search Results */}
          {searchQuery.trim().length > 0 && (
            <View
              style={[
                styles.searchResults,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              {searchResults.length === 0 ? (
                <Text
                  style={[
                    styles.noSearchResults,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  No results found
                </Text>
              ) : (
                searchResults.map((order) => (
                  <Pressable
                    key={order.id}
                    style={({ pressed }) => [
                      styles.searchResultItem,
                      pressed && {
                        backgroundColor: colors.backgroundLight,
                      },
                    ]}
                    onPress={() => {
                      router.push({
                        pathname: "/customer/details",
                        params: {
                          customerId: String(order.customer_id),
                        },
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.searchIcon,
                        {
                          backgroundColor: colors.backgroundLight,
                        },
                      ]}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={20}
                        color={colors.textGold}
                      />
                    </View>

                    <View style={styles.searchResultInfo}>
                      <Text
                        style={[
                          styles.searchResultTitle,
                          {
                            color: colors.text,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {order.customerName || "Unknown Customer"}
                      </Text>

                      <Text
                        style={[
                          styles.searchResultSubtitle,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {order.order_code} • {order.customerPhone || "No phone"}
                      </Text>

                      <Text
                        style={[
                          styles.searchResultStatus,
                          {
                            color: colors.textGold,
                          },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                ))
              )}
            </View>
          )}
        </View>
      </View>

      {/* User Card */}
      <ImageBackground
        source={require("../assets/images/profile.png")}
        style={[
          styles.userCard,
          {
            width: width * 0.92,
          },
        ]}
        imageStyle={styles.userCardImage}
      >
        <View style={styles.imageOverlay} />

        <View style={styles.userDetails}>
          <Text
            style={[
              styles.userName,
              {
                color: colors.primary,
              },
            ]}
          >
            {user ? `${user.First_Name} ${user.Last_Name}`.trim() : "User"}
          </Text>

          <Text
            style={[
              styles.userPhone,
              {
                color: colors.primary,
              },
            ]}
          >
            {user?.phone || ""}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            router.push("/customer/add");
          }}
          style={({ pressed }) => [
            styles.orderButton,
            {
              borderColor: colors.textGold,
            },
            pressed && {
              backgroundColor: colors.textGold,
            },
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.orderButtonText,
                {
                  color: colors.textGold,
                },
                pressed && {
                  color: colors.secondaryDark,
                },
              ]}
            >
              {t("orderNow")}
            </Text>
          )}
        </Pressable>
      </ImageBackground>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Services Header */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.text,
              {
                color: colors.text,
              },
            ]}
          >
            {t("ourServices")}
          </Text>

          <Pressable
            onPress={() => {
              router.push("/services/details");
            }}
            hitSlop={10}
          >
            <Text
              style={[
                styles.subText,
                {
                  color: colors.textGold,
                },
              ]}
            >
              {t("viewAll")}
            </Text>
          </Pressable>
        </View>

        {/* Services */}
        <FlatList
          data={services}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.servicesList}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              orderCount={serviceOrderCounts[item.id] || 0}
              onPress={() => {
                console.log("Selected service:", item.name);
              }}
            />
          )}
        />

        {/* Orders Header */}
        <View style={styles.orders}>
          <Text
            style={[
              styles.text,
              {
                color: colors.text,
              },
            ]}
          >
            {t("myOrders")}
          </Text>

          <Pressable onPress={() => router.push("/orders")}>
            <Text
              style={[
                styles.subText,
                {
                  color: colors.textGold,
                },
              ]}
            >
              {t("viewAll")}
            </Text>
          </Pressable>
        </View>

        {/* Orders */}
        {orders.length === 0 ? (
          <View
            style={[
              styles.orderPlaceholder,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.noOrdersText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {t("noOrdersYet")}
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCardContainer}>
              <OrderCard order={order} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Greetings;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  header: {
    height: 300,
    paddingHorizontal: 16,
    paddingTop: 45,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greetingContainer: {
    flex: 1,
  },

  greetingText: {
    fontSize: theme.font.size.extralarge,
    fontWeight: "800",
  },

  greetingText2: {
    marginTop: 3,
    fontSize: theme.font.size.small,
    fontWeight: "400",
  },

  notification: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  searchWrapper: {
    position: "relative",
    zIndex: 100,
  },

  searchContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: theme.radius.round,
    borderWidth: 1,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: theme.font.size.medium,
  },

  searchResults: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 6,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },

  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },

  searchResultTitle: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  searchResultSubtitle: {
    marginTop: 3,
    fontSize: theme.font.size.small,
  },

  searchResultStatus: {
    marginTop: 3,
    fontSize: theme.font.size.small,
    fontWeight: "600",
  },

  noSearchResults: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: theme.font.size.small,
  },

  userCard: {
    position: "absolute",
    top: 190,
    alignSelf: "center",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 7,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 10,
  },

  userCardImage: {
    resizeMode: "cover",
    borderRadius: 20,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  userDetails: {
    padding: 20,
  },

  userName: {
    fontSize: theme.font.size.display,
    fontWeight: "700",
  },

  userPhone: {
    marginTop: 4,
    fontSize: theme.font.size.medium,
  },

  orderButton: {
    position: "absolute",
    bottom: 18,
    right: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: "transparent",
  },

  orderButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  scrollContent: {
    paddingTop: 85,
    paddingBottom: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  text: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  subText: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  orders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
  },

  orderCardContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },

  orderPlaceholder: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  noOrdersText: {
    fontSize: theme.font.size.small,
  },
});
