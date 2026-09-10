import { theme } from "@/styles/theme";
import { Customer } from "@/Utils/infoDetails";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

interface CustomerHeaderProps {
  customer: Customer;
}

export default function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <View style={styles.customerCard}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color={theme.color.secondaryDark} />
      </View>

      <View>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerPhone}>{customer.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerCard: {
    margin: 16,
    padding: 14,
    borderColor: theme.color.border,
    elevation: 5,
    borderRadius: theme.radius.medium,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.backgroundDark,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.round,
    backgroundColor: theme.color.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  customerName: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
    color: theme.color.secondaryDark,
  },
  customerPhone: {
    marginTop: 4,
    color: theme.color.textLight,
  },
});
