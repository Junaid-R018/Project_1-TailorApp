import { useTheme } from "@/app/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
  onLongPress: () => void;
  customerNumber: number;
}

const CustomerCard = ({
  customer,
  customerNumber,
  onPress,
  onLongPress,
}: CustomerCardProps) => {
  const { colors } = useTheme();

  const handleWhatsApp = async () => {
    const phone = customer.phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${phone}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("whats App error", error);
    }
  };

  const handleCall = async () => {
    const phone = customer.phone.replace(/[^0-9]/g, "");
    const url = `tel:${phone}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("Phone call error", error);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {
              color: colors.text,
            },
          ]}
        >
          {customerNumber}, {customer.first_name}
        </Text>

        <Text
          style={[
            styles.phone,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {customer.phone}
        </Text>
      </View>

      <View style={styles.actionBtn}>
        {/* WhatsApp */}
        <Pressable
          onPress={handleWhatsApp}
          style={({ pressed }) => [
            styles.icon,
            pressed && [
              styles.iconPressed,
              {
                backgroundColor: colors.disabledBackground,
              },
            ],
          ]}
        >
          <Ionicons name="logo-whatsapp" size={24} color={colors.success} />
        </Pressable>

        {/* Call */}
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [
            styles.icon,
            pressed && [
              styles.iconPressed,
              {
                backgroundColor: colors.disabledBackground,
              },
            ],
          ]}
        >
          <Ionicons name="call" size={24} color={colors.error} />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default CustomerCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.medium,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    marginHorizontal: 10,
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  cardPressed: {
    opacity: 0.7,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  name: {
    fontSize: theme.font.size.small,
    fontWeight: "700",
    marginBottom: 12,
  },

  phone: {
    fontSize: theme.font.size.small,
    fontWeight: "400",
    left: 15,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },

  icon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.round,
  },

  iconPressed: {
    opacity: 0.7,
  },
});
