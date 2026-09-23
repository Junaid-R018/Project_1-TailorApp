import { useTheme } from "@/app/context/ThemeContext";
import { Service } from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  service: Service;
  orderCount?: number;
  onPress?: () => void;
};

const ServiceCard = ({ service, orderCount = 0, onPress }: Props) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
        },
        pressed && {
          opacity: 0.8,
          transform: [{ scale: 0.97 }],
        },
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.secondaryLight,
          },
        ]}
      >
        <Ionicons
          name={(service.icon || "shirt-outline") as any}
          size={30}
          color={colors.primary}
        />
      </View>

      {/* Service information */}
      <View style={styles.content}>
        {/* Name + Arrow */}
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.serviceName,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {service.name}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.textSecondary}
          />
        </View>

        {/* Order count */}
        <Text
          style={[
            styles.orderCount,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {orderCount} {orderCount === 1 ? "order" : "orders"}
        </Text>
      </View>
    </Pressable>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: 170,
    minHeight: 118,
    marginRight: 12,
    borderRadius: theme.radius.large,
    padding: 14,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    marginTop: 10,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  serviceName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 6,
  },

  orderCount: {
    fontSize: 12,
    marginTop: 3,
  },
});
