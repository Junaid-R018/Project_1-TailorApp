import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import { getOrdersByCustomerId } from "@/sqliteDB/order";
import { theme } from "@/styles/theme";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OrderCard from "./orderCard";
interface OrdersProps {
  customer: Customer;
}
export default function Orders({ customer }: OrdersProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        try {
          setLoading(true);
          const data = await getOrdersByCustomerId(customer.id);
          // console.log("Orders for customer:", customer.id, data);

          setOrders(data);
        } catch (error) {
          console.error("Failed to load customer orders:", error);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    }, [customer.id]),
  );
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("orders")}
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t("loadingOrders")}
          </Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("noOrdersYet")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderCard order={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "700",
    marginBottom: 14,
  },
  loadingContainer: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { marginTop: 8 },
  listContent: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16 },
});
