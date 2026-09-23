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
  const { t, language } = useLanguage();

  const isUrdu = language === "ur";

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

  // ---------------------------------------------------------
  // DATE
  // ---------------------------------------------------------

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isUrdu ? "ur-PK" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // MEASUREMENT TRANSLATIONS
  // ---------------------------------------------------------

  const measurementTranslations: Record<string, string> = {
    // Sections
    shirt: "قمیض",
    pant: "پینٹ",
    trouser: "ٹراؤزر",
    shalwar: "شلوار",
    kameez: "قمیض",
    shalwarKameez: "شلوار قمیض",
    waistcoat: "واسکٹ",
    others: "دیگر",

    // Fields
    collar: "کالر",
    ban: "بین",
    length: "لمبائی",
    shoulder: "کندھا",
    chest: "سینہ",
    waist: "کمر",
    hip: "کولہا",
    sleeve: "آستین",
    sleeveLength: "آستین کی لمبائی",
    cuff: "کف",
    armhole: "بازو کا گھیر",
    neck: "گلا",
    bottom: "دامن",
    thigh: "ران",
    knee: "گھٹنا",
    ankle: "ٹخنہ",
    inseam: "اندرونی لمبائی",
    outseam: "بیرونی لمبائی",
    pocket: "جیب",
    pockets: "جیبیں",
    shalwarLength: "شلوار کی لمبائی",
    kameezLength: "قمیض کی لمبائی",
    waistcoatLength: "واسکٹ کی لمبائی",
  };

  const translateMeasurementText = (name: string) => {
    if (!isUrdu) {
      return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
    }

    // Exact match first
    if (measurementTranslations[name]) {
      return measurementTranslations[name];
    }

    // Try lowercase
    const lowerName = name.toLowerCase();

    if (measurementTranslations[lowerName]) {
      return measurementTranslations[lowerName];
    }

    // Convert camelCase / normal text
    const formatted = name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();

    return measurementTranslations[formatted.toLowerCase()] || formatted;
  };

  // ---------------------------------------------------------
  // UNIT TRANSLATION
  // ---------------------------------------------------------

  const translateUnit = (unit: string) => {
    if (!isUrdu) {
      return unit;
    }

    const normalized = unit.toLowerCase();

    if (normalized === "inch" || normalized === "inches") {
      return "انچ";
    }

    if (normalized === "cm" || normalized === "centimeter") {
      return "سینٹی میٹر";
    }

    return unit;
  };

  // ---------------------------------------------------------
  // PARSE MEASUREMENTS
  // ---------------------------------------------------------

  const parsedMeasurements = useMemo<ParsedMeasurements | null>(() => {
    if (!selectedMeasurement) return null;

    try {
      return JSON.parse(selectedMeasurement.measurements);
    } catch (error) {
      console.error("Failed to parse measurements:", error);
      return null;
    }
  }, [selectedMeasurement]);

  // ---------------------------------------------------------
  // ONLY SHOW SECTIONS THAT HAVE VALUES
  // ---------------------------------------------------------

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
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* -------------------------------------------------- */}
      {/* CURRENT MEASUREMENTS TITLE */}
      {/* -------------------------------------------------- */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
            textAlign: isUrdu ? "right" : "left",
          },
        ]}
      >
        {selectedMeasurement &&
        measurements.length > 0 &&
        selectedMeasurement.id === measurements[0].id
          ? t("currentMeasurements")
          : t("measurementDetails")}
      </Text>

      {/* -------------------------------------------------- */}
      {/* LOADING */}
      {/* -------------------------------------------------- */}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />

          <Text
            style={[
              styles.message,
              {
                color: colors.textSecondary,
                textAlign: isUrdu ? "right" : "left",
              },
            ]}
          >
            {t("loadingMeasurements")}
          </Text>
        </View>
      ) : selectedMeasurement && parsedMeasurements ? (
        <>
          {/* -------------------------------------------------- */}
          {/* MEASUREMENT CARD */}
          {/* -------------------------------------------------- */}

          <View
            style={[
              styles.measurementCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.measurementContent}
            >
              {filledSections.length > 0 ? (
                filledSections.map(([sectionName, section]) => (
                  <View
                    key={sectionName}
                    style={[
                      styles.measurementSection,
                      {
                        direction: isUrdu ? "rtl" : "ltr",
                      } as any,
                    ]}
                  >
                    {/* Section name */}
                    <Text
                      style={[
                        styles.measurementSectionTitle,
                        {
                          color: colors.secondaryLight,
                          borderBottomColor: colors.primary,
                          textAlign: isUrdu ? "right" : "left",
                          writingDirection: isUrdu ? "rtl" : "ltr",
                        },
                      ]}
                    >
                      {translateMeasurementText(sectionName)}
                    </Text>

                    {/* Fields */}
                    {Object.entries(section).map(([fieldName, value]) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return null;
                      }

                      const translatedUnit = translateUnit(
                        selectedMeasurement.unit,
                      );

                      return (
                        <View
                          key={fieldName}
                          style={[
                            styles.row,
                            {
                              borderBottomColor: colors.border,
                              flexDirection: isUrdu ? "row-reverse" : "row",
                            },
                          ]}
                        >
                          {/* Label */}
                          <Text
                            style={[
                              styles.label,
                              {
                                color: colors.textSecondary,
                                textAlign: isUrdu ? "right" : "left",
                                writingDirection: isUrdu ? "rtl" : "ltr",
                              },
                            ]}
                          >
                            {translateMeasurementText(fieldName)}
                          </Text>

                          {/* Value */}
                          <Text
                            style={[
                              styles.value,
                              {
                                color: colors.text,
                                textAlign: isUrdu ? "left" : "right",
                                writingDirection: isUrdu ? "rtl" : "ltr",
                              },
                            ]}
                          >
                            {value} {translatedUnit}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))
              ) : (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                      textAlign: isUrdu ? "right" : "left",
                    },
                  ]}
                >
                  {t("noMeasurementDetails")}
                </Text>
              )}
            </ScrollView>
          </View>

          {/* -------------------------------------------------- */}
          {/* NOTES */}
          {/* -------------------------------------------------- */}

          {selectedMeasurement.notes ? (
            <View
              style={[
                styles.notesCard,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.notesTitle,
                  {
                    color: colors.text,
                    textAlign: isUrdu ? "right" : "left",
                    writingDirection: isUrdu ? "rtl" : "ltr",
                  },
                ]}
              >
                {t("notes")}
              </Text>

              <Text
                style={[
                  styles.notesText,
                  {
                    color: colors.textSecondary,
                    textAlign: isUrdu ? "right" : "left",
                    writingDirection: isUrdu ? "rtl" : "ltr",
                  },
                ]}
              >
                {selectedMeasurement.notes}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
                textAlign: isUrdu ? "right" : "left",
              },
            ]}
          >
            {t("noMeasurements")}
          </Text>
        </View>
      )}

      {/* -------------------------------------------------- */}
      {/* MEASUREMENT HISTORY */}
      {/* -------------------------------------------------- */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
            textAlign: isUrdu ? "right" : "left",
          },
        ]}
      >
        {t("measurementHistory")}
      </Text>

      {!loading && measurements.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
                textAlign: isUrdu ? "right" : "left",
              },
            ]}
          >
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
                {
                  backgroundColor: colors.card,
                  flexDirection: isUrdu ? "row-reverse" : "row",
                },
                isSelected && {
                  borderColor: colors.primary,
                },
                pressed && styles.historyPressed,
              ]}
            >
              {/* History left */}
              <View
                style={[
                  styles.historyLeft,
                  {
                    alignItems: isUrdu ? "flex-end" : "flex-start",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.date,
                    {
                      color: colors.text,
                      textAlign: isUrdu ? "right" : "left",
                    },
                  ]}
                >
                  {formatDate(measurement.created_at)}
                </Text>

                <Text
                  style={[
                    styles.historyType,
                    {
                      color: colors.textSecondary,
                      textAlign: isUrdu ? "right" : "left",
                    },
                  ]}
                >
                  {index === 0
                    ? t("currentMeasurement")
                    : t("previousMeasurement")}
                </Text>

                <Text
                  style={[
                    styles.unit,
                    {
                      color: colors.textSecondary,
                      textAlign: isUrdu ? "right" : "left",
                    },
                  ]}
                >
                  {t("unit")}: {translateUnit(measurement.unit)}
                </Text>
              </View>

              {/* View button */}
              <View
                style={[
                  styles.historyRight,
                  {
                    flexDirection: isUrdu ? "row-reverse" : "row",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.viewText,
                    {
                      color: colors.primaryDark,
                    },
                  ]}
                >
                  {t("view")}
                </Text>

                <Text
                  style={[
                    styles.arrow,
                    {
                      color: colors.secondaryLight,
                      transform: [
                        {
                          rotate: isUrdu ? "180deg" : "0deg",
                        },
                      ],
                    },
                  ]}
                >
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
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

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

  message: {
    marginTop: 8,
  },

  measurementCard: {
    borderRadius: theme.radius.medium,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 330,
    overflow: "hidden",
  },

  measurementContent: {
    padding: 16,
  },

  measurementSection: {
    marginBottom: 18,
  },

  measurementSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },

  row: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },

  label: {
    flex: 1,
    fontSize: 14,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  notesCard: {
    borderRadius: theme.radius.medium,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },

  notesTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  notesText: {
    fontSize: 14,
    lineHeight: 21,
  },

  emptyCard: {
    padding: 20,
    borderRadius: theme.radius.medium,
    marginBottom: 24,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
  },

  historyCard: {
    padding: 14,
    borderRadius: theme.radius.medium,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 0,
  },

  historyPressed: {
    opacity: 0.7,
  },

  historyLeft: {
    flex: 1,
  },

  date: {
    fontSize: 15,
    fontWeight: "600",
  },

  historyType: {
    fontSize: theme.font.size.small,
    marginTop: 4,
  },

  unit: {
    fontSize: 13,
    marginTop: 5,
  },

  historyRight: {
    alignItems: "center",
    marginLeft: 10,
  },

  viewText: {
    fontSize: 13,
    fontWeight: "600",
  },

  arrow: {
    fontSize: 28,
    marginLeft: 4,
  },
});
