import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { Customer } from "@/sqliteDB/customer";
import {
  getCustomerMeasurements,
  MeasurementRecord,
} from "@/sqliteDB/measurement";
import { theme } from "@/styles/theme";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
interface MeasurementsProps {
  customer: Customer;
}
type MeasurementSection = Record<string, string>;
type ParsedMeasurements = Record<string, MeasurementSection>;
export default function Measurements({ customer }: MeasurementsProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementRecord | null>(null);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const loadMeasurements = async () => {
        try {
          setLoading(true);
          const data = await getCustomerMeasurements(customer.id);
          // console.log("Customer Measurements:", data);
          setMeasurements(data);
          if (data.length > 0) {
            setSelectedMeasurement(data[0]);
          } else {
            setSelectedMeasurement(null);
          }
        } catch (error) {
          console.error("Failed to load measurements:", error);
        } finally {
          setLoading(false);
        }
      };
      loadMeasurements();
    }, [customer.id]),
  );
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatSectionName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  };
  const formatFieldName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  };
  const parsedMeasurements = useMemo<ParsedMeasurements | null>(() => {
    if (!selectedMeasurement) return null;
    try {
      return JSON.parse(selectedMeasurement.measurements);
    } catch (error) {
      console.error("Failed to parse measurements:", error);
      return null;
    }
  }, [selectedMeasurement]);
  const filledSections = useMemo(() => {
    if (!parsedMeasurements) return [];
    return Object.entries(parsedMeasurements).filter(
      ([, section]) =>
        section &&
        typeof section === "object" &&
        Object.values(section).some(
          (value) => value !== undefined && value !== null && value !== "",
        ),
    );
  }, [parsedMeasurements]);
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= CURRENT MEASUREMENT ================= */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {selectedMeasurement &&
        measurements.length > 0 &&
        selectedMeasurement.id === measurements[0].id
          ? t("currentMeasurements")
          : t("measurementDetails")}
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {t("loadingMeasurements")}
          </Text>
        </View>
      ) : selectedMeasurement && parsedMeasurements ? (
        <>
          <View
            style={[styles.measurementCard, { backgroundColor: colors.card }]}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.measurementContent}
            >
              {filledSections.length > 0 ? (
                filledSections.map(([sectionName, section]) => (
                  <View key={sectionName} style={styles.measurementSection}>
                    <Text
                      style={[
                        styles.measurementSectionTitle,
                        {
                          color: colors.secondaryLight,
                          borderBottomColor: colors.primary,
                        },
                      ]}
                    >
                      {formatSectionName(sectionName)}
                    </Text>
                    {Object.entries(section).map(([fieldName, value]) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return null;
                      }
                      return (
                        <View
                          key={fieldName}
                          style={[
                            styles.row,
                            { borderBottomColor: colors.border },
                          ]}
                        >
                          <Text
                            style={[
                              styles.label,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {formatFieldName(fieldName)}
                          </Text>
                          <Text style={[styles.value, { color: colors.text }]}>
                            {value} {selectedMeasurement.unit}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))
              ) : (
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {t("noMeasurementDetails")}
                </Text>
              )}
            </ScrollView>
          </View>
          {selectedMeasurement.notes ? (
            <View style={[styles.notesCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.notesTitle, { color: colors.text }]}>
                {t("notes")}
              </Text>

              <Text
                style={[
                  styles.notesText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {selectedMeasurement.notes}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("noMeasurements")}
          </Text>
        </View>
      )}
      {/* ================= HISTORY ================= */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("measurementHistory")}
      </Text>
      {!loading && measurements.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("noMeasurementHistory")}
          </Text>
        </View>
      ) : (
        measurements.map((measurement, index) => {
          const isSelected = selectedMeasurement?.id === measurement.id;
          return (
            <Pressable
              key={measurement.id}
              onPress={() => setSelectedMeasurement(measurement)}
              style={({ pressed }) => [
                styles.historyCard,
                { backgroundColor: colors.card },
                isSelected && { borderColor: colors.primary },
                pressed && styles.historyPressed,
              ]}
            >
              <View style={styles.historyLeft}>
                <Text style={[styles.date, { color: colors.text }]}>
                  {formatDate(measurement.created_at)}
                </Text>
                <Text
                  style={[styles.historyType, { color: colors.textSecondary }]}
                >
                  {index === 0
                    ? t("currentMeasurement")
                    : t("previousMeasurement")}
                </Text>
                <Text style={[styles.unit, { color: colors.textSecondary }]}>
                  {t("unit")}: {measurement.unit}
                </Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={[styles.viewText, { color: colors.primaryDark }]}>
                  {t("view")}
                </Text>
                <Text style={[styles.arrow, { color: colors.secondaryLight }]}>
                  ›
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 30 },
  sectionTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    marginBottom: 14,
  },
  loadingContainer: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  message: { marginTop: 8 },
  measurementCard: {
    borderRadius: theme.radius.medium,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 330,
    overflow: "hidden",
  },
  measurementContent: { padding: 16 },
  measurementSection: { marginBottom: 18 },
  measurementSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  label: { flex: 1, fontSize: 14 },
  value: { fontSize: 15, fontWeight: "600" },
  notesCard: {
    borderRadius: theme.radius.medium,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  notesTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  notesText: { fontSize: 14, lineHeight: 21 },
  emptyCard: {
    padding: 20,
    borderRadius: theme.radius.medium,
    marginBottom: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 15 },
  historyCard: {
    padding: 14,
    borderRadius: theme.radius.medium,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 0,
  },
  historyPressed: { opacity: 0.7 },
  historyLeft: { flex: 1 },
  date: { fontSize: 15, fontWeight: "600" },
  historyType: { fontSize: theme.font.size.small, marginTop: 4 },
  unit: { fontSize: 13, marginTop: 5 },
  historyRight: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  viewText: { fontSize: 13, fontWeight: "600" },
  arrow: { fontSize: 28, marginLeft: 4 },
});
