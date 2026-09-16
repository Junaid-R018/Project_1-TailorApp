import CustomerCard from "@/components/CustomerCard";
import { Customer, deleteCustomer, getCustomers } from "@/sqliteDB/customer";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Customers = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, []),
  );

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      console.log("Faild to load customers from database", error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = () => {
    router.push("/customer/add");
  };

  const handleDeleteCustomer = (customerId: number, customerName: string) => {
    Alert.alert(
      t("deleteCustomer"),
      `${t("deleteCustomerConfirmation")} ${customerName}?`,
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(customerId);

              // Reload customers from SQLite
              const updatedCustomers = await getCustomers();
              setCustomers(updatedCustomers);
            } catch (error) {
              console.error("Failed to delete customer:", error);
            }
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("customers"),

          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },

          headerTitleStyle: {
            color: colors.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },

          headerTintColor: colors.textWhite,
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.secondaryDark} />
        </View>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            customers.length === 0 && styles.emptyList,
          ]}
          refreshing={loading}
          onRefresh={loadCustomers}
          renderItem={({ item, index }) => (
            <CustomerCard
              customerNumber={index + 1}
              onLongPress={() =>
                handleDeleteCustomer(item.id, `${item.first_name}`.trim())
              }
              customer={item}
              onPress={() =>
                router.push({
                  pathname: "/customer/details",
                  params: {
                    customerId: item.id.toString(),
                  },
                })
              }
            />
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          {
            backgroundColor: colors.primary,
          },
          pressed && [
            styles.floatingButtonPressed,
            {
              backgroundColor: colors.primaryDark,
            },
          ],
        ]}
        onPress={addCustomer}
      >
        <Ionicons name="person-add" size={36} color={colors.secondaryDark} />
      </Pressable>
    </SafeAreaView>
  );
};

export default Customers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingBottom: 100,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: theme.radius.medium,
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
    transform: [{ scale: 0.8 }],
  },
});
