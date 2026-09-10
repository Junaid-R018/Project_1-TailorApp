import { Customer } from "@/Utils/infoDetails";
import { FlatList, StyleSheet, Text, View } from "react-native";
import OrderCard from "./orderCard";

interface OrdersProps {
  customer: Customer;
}

export default function Orders({ customer }: OrdersProps) {
  return (
    <View style={styles.page}>
      <Text style={styles.sectionTitle}>Orders</Text>

      <FlatList
        data={customer.orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B1F3A",
    marginBottom: 14,
  },
});
