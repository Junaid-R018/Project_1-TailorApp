import { theme } from "@/styles/theme";
import { Customer } from "@/Utils/customerData";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

const CustomerCard = ({ customer, onPress }: CustomerCardProps) => {
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
      console.log("Phone call erro", error);
    }
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.info}>
        <Text style={styles.name}>
          {customer.id}, {customer.name}
        </Text>
        <Text style={styles.phone}>{customer.phone}</Text>
      </View>

      <View style={styles.actionBtn}>
        <Pressable
          onPress={handleWhatsApp}
          style={({ pressed }) => [styles.icon, pressed && styles.iconPressed]}
        >
          <Ionicons
            name="logo-whatsapp"
            size={24}
            color={theme.color.success}
          />
        </Pressable>

        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [styles.icon, pressed && styles.iconPressed]}
        >
          <Ionicons name="call" size={24} color={theme.color.error} />
        </Pressable>
      </View>
    </Pressable>
  );
};
export default CustomerCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.medium,
    backgroundColor: theme.color.backgroundLight,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    marginHorizontal: 10,
    elevation: 5,
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
    color: theme.color.text,
    marginBottom: 12,
  },
  phone: {
    fontSize: theme.font.size.small,
    fontWeight: "400",
    color: theme.color.text,
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
    backgroundColor: theme.color.backgroundDark,
  },
});
