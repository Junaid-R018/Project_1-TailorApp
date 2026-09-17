import { useTheme } from "@/app/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
interface CustomerHeaderProps {
  customer: Customer;
}
export default function CustomerHeader({ customer }: CustomerHeaderProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.customerCard,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={24} color={colors.secondaryDark} />
      </View>
      <View>
        <Text style={[styles.customerName, { color: colors.text }]}>
          {customer.first_name}
        </Text>
        <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>
          {customer.phone}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  customerCard: {
    margin: 16,
    padding: 14,
    borderWidth: 1,
    elevation: 5,
    borderRadius: theme.radius.medium,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  customerName: { fontSize: theme.font.size.medium, fontWeight: "600" },
  customerPhone: { marginTop: 4 },
});
