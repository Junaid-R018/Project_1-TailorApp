import { theme } from "@/styles/theme";
import { Order } from "@/Utils/infoDetails";
import { ScrollView, StyleSheet, Text, View } from "react-native";
interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>

          <Text style={styles.status}>{order.status}</Text>
        </View>

        <Text style={styles.date}>{order.date}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.item}>Tailoring Order</Text>

          <Text style={styles.total}>Rs. {order.total}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.textWhite,
    padding: 14,
    borderRadius: theme.radius.medium,
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderNumber: {
    fontSize: theme.font.size.medium,
    fontWeight: "500",
    color: theme.color.text,
  },

  status: {
    fontSize: theme.font.size.medium,
    fontWeight: "400",
  },

  date: {
    marginTop: 6,
    color: theme.color.textSecondary,
  },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    color: theme.color.textSecondary,
  },

  total: {
    fontSize: theme.font.size.small,
    fontWeight: "700",
    color: theme.color.text,
  },
});
