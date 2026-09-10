import { theme } from "@/styles/theme";
import { servicesData } from "@/Utils/dummyData";
import { Spacer15 } from "@/Utils/spacing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import ServiceCard from "./ServiceCard";

const Greetings = () => {
  const { width } = useWindowDimensions();

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const day = now.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.greetingText2}>
              {day}, {date}
            </Text>
          </View>
          <Pressable
            style={styles.notification}
            onPress={() => router.push("/Notifications")}
          >
            <Ionicons
              name="notifications"
              size={24}
              color={theme.color.textGold}
            />
          </Pressable>
        </View>
        <Spacer15 />
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.color.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search here..."
            placeholderTextColor={theme.color.textSecondary}
          />
        </View>
      </View>
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
          <Text style={styles.userName}>Rana Junaid</Text>
          <Text style={styles.userPhone}>0300 1234567</Text>
        </View>
        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [
            styles.orderButton,
            pressed && styles.orderButtonPressed,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.orderButtonText,
                pressed && styles.orderButtonTextPressed,
              ]}
            >
              Order Now
            </Text>
          )}
        </Pressable>
      </ImageBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.text}>Our Services</Text>
          <Pressable onPress={() => console.log("View all services")}>
            <Text style={styles.subText}>View all</Text>
          </Pressable>
        </View>
        <FlatList
          data={servicesData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.servicesList}
          renderItem={({ item }) => <ServiceCard service={item} />}
        />
        <View style={styles.orders}>
          <Text style={styles.text}>My Orders</Text>
          <Pressable onPress={() => console.log("View all orders")}>
            <Text style={styles.subText}>View all</Text>
          </Pressable>
        </View>
        <View style={styles.orderPlaceholder}>
          <Text style={styles.noOrdersText}>No orders yet</Text>
        </View>
        <View style={styles.orderPlaceholder}>
          <Text style={styles.noOrdersText}>No orders yet</Text>
        </View>
        <View style={styles.orderPlaceholder}>
          <Text style={styles.noOrdersText}>No orders yet</Text>
        </View>
        <View style={styles.orderPlaceholder}>
          <Text style={styles.noOrdersText}>No orders yet</Text>
        </View>
        <View style={styles.orderPlaceholder}>
          <Text style={styles.noOrdersText}>No orders yet</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Greetings;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  header: {
    height: 300,
    backgroundColor: theme.color.secondaryDark,
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
    color: theme.color.textGold,
  },

  greetingText2: {
    marginTop: 3,
    fontSize: theme.font.size.small,
    fontWeight: "400",
    color: theme.color.textGold,
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
    backgroundColor: theme.color.backgroundLight,
    paddingHorizontal: 15,
    borderRadius: theme.radius.round,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: theme.font.size.medium,
    color: theme.color.text,
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
    color: theme.color.primary,
  },

  userPhone: {
    marginTop: 4,
    fontSize: theme.font.size.medium,
    color: theme.color.primary,
  },

  orderButton: {
    position: "absolute",
    bottom: 18,
    right: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: theme.color.textGold,
    borderRadius: 25,
    backgroundColor: "transparent",
  },

  orderButtonPressed: {
    backgroundColor: theme.color.textGold,
  },

  orderButtonText: {
    color: theme.color.textGold,
    fontSize: 14,
    fontWeight: "700",
  },

  orderButtonTextPressed: {
    color: theme.color.secondary,
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
    color: theme.color.text,
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  subText: {
    color: theme.color.textGold,
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
  orderPlaceholder: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.color.backgroundLight,
    elevation: 2,
  },
  noOrdersText: {
    color: theme.color.textSecondary,
    fontSize: theme.font.size.small,
  },
});
