import CustomerCard from "@/components/CustomerCard";
import { theme } from "@/styles/theme";
import { customerData } from "@/Utils/customerData";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Customers = () => {
  const addCustomer = () => {
    router.push("/customer/add");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Customers (${customerData.length})`,
          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },

          headerTitleStyle: {
            color: theme.color.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <FlatList
        data={customerData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            onPress={() =>
              router.push({
                pathname: "/customer/details",
                params: {
                  customerId: item.id,
                },
              })
            }
          />
        )}
      />
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          pressed && styles.floatingButtonPressed,
        ]}
        onPress={addCustomer}
      >
        <Ionicons
          name="person-add"
          size={36}
          color={theme.color.secondaryDark}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Customers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 100,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.color.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  floatingButtonPressed: {
    backgroundColor: theme.color.primaryDark,
    transform: [{ scale: 0.8 }],
  },
});
