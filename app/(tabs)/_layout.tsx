import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: "#A7A7A7",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={focused ? theme.color.secondary : "#A7A7A7"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={size}
                color={focused ? theme.color.secondary : "#A7A7A7"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="measurements"
        options={{
          title: "Measurements",
          tabBarIcon: ({ focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "resize" : "resize-outline"}
                size={size}
                color={focused ? theme.color.secondary : "#A7A7A7"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={focused ? theme.color.secondary : "#A7A7A7"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.color.secondaryLight,
    borderTopWidth: 0,
    height: 80,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },

  label: {
    marginTop: 3,
    fontSize: theme.font.size.small,
    fontWeight: "700",
  },

  iconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIcon: {
    backgroundColor: theme.color.primary,
    width: 38,
    height: 38,
    borderRadius: theme.radius.small,
  },
});
