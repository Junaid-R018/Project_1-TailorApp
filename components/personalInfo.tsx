import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";
import InfoRow from "./infoRow";
interface PersonalInfoProps {
  customer: Customer;
}
export default function PersonalInfo({ customer }: PersonalInfoProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("personalInfo")}
      </Text>
      <InfoRow label={t("customerName")} value={customer.first_name} />
      <InfoRow label={t("phone")} value={customer.phone} />
      <InfoRow
        label={t("Advance Amount")}
        value={String(customer.advance_amount)}
      />
      <InfoRow label={t("Address")} value={customer.address ?? ""} />
      <InfoRow
        label={t("customerSince")}
        value={formatDate(customer.created_at)}
      />
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
});
