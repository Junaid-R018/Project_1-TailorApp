import { useTheme } from "@/app/context/ThemeContext";
import NotificationCard from "@/components/NotificationCard";
import { notifications } from "@/Utils/notificationData";
import { Stack } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },
          headerTintColor: colors.textWhite,
          headerTitleStyle: {
            color: colors.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />

      <View style={styles.content}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
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

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
    },

    list: {
      paddingVertical: 10,
    },
  });
