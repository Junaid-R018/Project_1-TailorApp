import { useTheme } from "@/context/ThemeContext";
import { NotificationRecord } from "@/sqliteDB/notification";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NotificationCardProps = {
  notificationData: NotificationRecord;
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
};

const NotificationCard = ({
  notificationData,
  onDelete,
  onPress,
}: NotificationCardProps) => {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const isUnread = notificationData.is_read === 0;

  return (
    <Pressable
      onPress={() => onPress(notificationData.id)}
      style={[styles.card, isUnread && styles.unreadCard]}
    >
      <View style={styles.leftBorder} />

      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={20} color={colors.textGold} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {notificationData.title}
          </Text>

          {isUnread && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {notificationData.message}
        </Text>

        <Text style={styles.time}>
          {formatNotificationTime(notificationData.created_at)}
        </Text>
      </View>

      <Pressable
        onPress={() => onDelete(notificationData.id)}
        hitSlop={10}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </Pressable>
    </Pressable>
  );
};

export default NotificationCard;

const formatNotificationTime = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString();
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
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
      backgroundColor: colors.divider,
    },

    leftBorder: {
      width: 5,
      height: "100%",
      backgroundColor: colors.textGold,
    },

    iconContainer: {
      width: 42,
      height: 42,
      borderRadius: 999,
      backgroundColor: colors.primaryLight,
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
      color: colors.textNavy,
    },

    message: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
    },

    time: {
      marginTop: 6,
      fontSize: 11,
      color: colors.textSecondary,
    },

    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.primary,
      marginLeft: 8,
    },

    deleteButton: {
      padding: 12,
      marginRight: 4,
    },
  });
