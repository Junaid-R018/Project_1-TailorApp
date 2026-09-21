import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { OrderWithCustomer } from "@/sqliteDB/order";
import { getServices, Service } from "@/sqliteDB/services";
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

  const [services, setServices] = useState<Service[]>([]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.log("Failed to load services", error);
    }
  };

  useEffect(() => {
    loadServices();
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

        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.backgroundLight,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />

          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
            placeholder={t("searchHere")}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* User Card */}
      <ImageBackground
        source={require("../assets/images/dp.png")}
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
            Rana Junaid
          </Text>

          <Text
            style={[
              styles.userPhone,
              {
                color: colors.primary,
              },
            ]}
          >
            0300 1234567
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

          <Pressable onPress={() => {}}>
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
          renderItem={({ item }) => <ServiceCard service={item} />}
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

  searchContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: theme.radius.round,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: theme.font.size.medium,
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
