import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: theme.color.border,
  },

  label: {
    fontSize: 12,
    color: theme.color.textSecondary,
  },

  value: {
    fontSize: theme.font.size.medium,
    color: theme.color.text,
    marginTop: 4,
  },
});
