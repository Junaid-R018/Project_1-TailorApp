import { ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/styles/theme";
import { Customer } from "@/Utils/infoDetails";
import MeasurementRow from "../components/measurementRow";

interface MeasurementsProps {
  customer: Customer;
}

export default function Measurements({ customer }: MeasurementsProps) {
  const currentMeasurement = customer.measurements[0];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.page}>
        <Text style={styles.sectionTitle}>Current Measurements</Text>

        {currentMeasurement && (
          <View style={styles.measurementCard}>
            <MeasurementRow
              label="Shirt Length"
              value={currentMeasurement.shirtLength}
            />

            <MeasurementRow
              label="Shoulder"
              value={currentMeasurement.shoulder}
            />

            <MeasurementRow label="Chest" value={currentMeasurement.chest} />

            <MeasurementRow label="Sleeve" value={currentMeasurement.sleeve} />
            <MeasurementRow label="Waist" value={currentMeasurement.waist} />
            <MeasurementRow
              label="Shalwar Length"
              value={currentMeasurement.ShalwarLength}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Measurement History</Text>

        {customer.measurements.map((measurement, index) => (
          <View key={measurement.id} style={styles.historyCard}>
            <Text style={styles.date}>{measurement.date}</Text>

            <Text style={styles.historyType}>
              {index === 0 ? "Current Measurement" : "Previous Measurement"}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    color: theme.color.text,
    marginBottom: 14,
  },

  measurementCard: {
    backgroundColor: theme.color.textWhite,
    padding: 16,
    borderRadius: theme.radius.medium,
    marginBottom: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  historyCard: {
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

  date: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.color.text,
  },

  historyType: {
    fontSize: theme.font.size.small,
    color: theme.color.textSecondary,
    marginTop: 4,
  },
});
