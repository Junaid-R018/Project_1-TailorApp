import NotificationCard from "@/components/NotificationCard";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  NotificationRecord,
} from "@/sqliteDB/notification";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      // console.log("NOTIFICATIONS AFTER DELETE:", data);
      setNotifications(data);
    } catch (error) {
      console.log("Failed to load notifications:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const handleNotificationPress = async (id: number) => {
    try {
      await markAllNotificationsAsRead();

      await loadNotifications();
    } catch (error) {
      console.log("Failed to mark notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    // console.log("DELETE CLICKED:", id);

    try {
      await deleteNotification(id);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );

      // console.log("DELETE SUCCESS:", id);
    } catch (error) {
      console.log("DELETE ERROR:", error);
    }
  };

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
            <NotificationCard
              notificationData={item}
              onPress={handleNotificationPress}
              onDelete={handleDeleteNotification}
            />
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
