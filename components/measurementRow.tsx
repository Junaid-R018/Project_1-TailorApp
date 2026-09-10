import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface MeasurementRowProps {
  label: string;
  value: number;
}

export default function MeasurementRow({ label, value }: MeasurementRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}&quot;</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.color.border,
  },

  label: {
    fontSize: theme.font.size.medium,
    color: theme.color.textSecondary,
  },

  value: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
    color: theme.color.text,
  },
});
