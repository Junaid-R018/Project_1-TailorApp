import NotificationCard from "@/components/NotificationCard";
import { theme } from "@/styles/theme";
import { notifications } from "@/Utils/notificationData";
import { Stack } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },

          headerTintColor: theme.color.textWhite,
          headerTitleStyle: {
            color: theme.color.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <View>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard notificationData={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  list: {
    paddingVertical: 10,
  },
});
