import { Customer } from "@/Utils/infoDetails";
import { StyleSheet, Text, View } from "react-native";
import InfoRow from "./infoRow";

interface PersonalInfoProps {
  customer: Customer;
}

export default function PersonalInfo({ customer }: PersonalInfoProps) {
  return (
    <View style={styles.page}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <InfoRow label="Name" value={customer.name} />
      <InfoRow label="Phone" value={customer.phone} />
      <InfoRow label="Address" value={customer.address} />
      <InfoRow label="Customer Since" value="January 2026" />
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
