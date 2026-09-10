import { Notification } from "@/Utils/notificationData";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type NotificationCardProps = {
  notificationData: Notification;
};

const NotificationCard = ({ notificationData }: NotificationCardProps) => {
  return (
    <View style={[styles.card, !notificationData.read && styles.unreadCard]}>
      <View style={styles.leftBorder} />

      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={20} color={theme.color.textGold} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {notificationData.title}
          </Text>

          {!notificationData.read && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {notificationData.message}
        </Text>

        <Text style={styles.time}>{notificationData.time}</Text>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.textWhite,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    overflow: "hidden",
  },

  unreadCard: {
    backgroundColor: "#FFFDF5",
  },

  leftBorder: {
    width: 5,
    height: "100%",
    backgroundColor: theme.color.textGold,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.round,
    backgroundColor: theme.color.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: theme.color.textNavy,
  },

  message: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
  },

  time: {
    marginTop: 6,
    fontSize: 11,
    color: theme.color.textSecondary,
  },

  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: theme.radius.round,
    backgroundColor: theme.color.primary,
    marginLeft: 8,
  },
});
