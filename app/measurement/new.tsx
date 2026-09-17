import { measurementSections } from "@/Utils/measurementData";
import { Spacer40 } from "@/Utils/spacing";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import MainButton from "@/components/MainButton ";
import InputField from "@/components/inputField";
import {
  addMeasurement,
  getCustomerMeasurements,
  updateMeasurement,
} from "@/sqliteDB/measurement";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Unit = "inch" | "cm";

type Measurements = Record<string, Record<string, string>>;

const emptyMeasurements: Measurements = {};

measurementSections.forEach((section) => {
  emptyMeasurements[section.key] = {};

  section.fields.forEach((field) => {
    emptyMeasurements[section.key][field.key] = "";
  });
});

const MeasurementsScreen = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const params = useLocalSearchParams<{
    customerId: string;
    measurementId?: string;
    mode?: string;
  }>();

  const customerId = Number(params.customerId);

  const mode = params.mode === "new" ? "new" : "edit";

  const measurementId = params.measurementId
    ? Number(params.measurementId)
    : null;

  const [unit, setUnit] = useState<Unit>("inch");
  const [openSection, setOpenSection] = useState("shirt");
  const [measurements, setMeasurements] =
    useState<Measurements>(emptyMeasurements);
  const [others, setOthers] = useState("");

  useEffect(() => {
    const loadMeasurement = async () => {
      try {
        const records = await getCustomerMeasurements(customerId);

        const record = records.find((item) => item.id === measurementId);

        if (!record) {
          console.log("Measurement not found");
          return;
        }

        const savedMeasurements = JSON.parse(record.measurements);

        setMeasurements(savedMeasurements);
        setUnit(record.unit);
        setOthers(record.notes ?? "");
      } catch (error) {
        console.log("Failed to load measurement:", error);
      }
    };

    if (mode === "edit" && measurementId) {
      loadMeasurement();
    }
  }, [mode, customerId, measurementId]);

  const handleFieldChange = (
    sectionKey: string,
    fieldKey: string,
    value: string,
  ) => {
    setMeasurements((previous) => ({
      ...previous,
      [sectionKey]: {
        ...previous[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSection((previous) => (previous === sectionKey ? "" : sectionKey));
  };

  const convertValue = (value: string) => {
    if (!value) return "";

    const number = parseFloat(value);

    if (Number.isNaN(number)) return value;

    if (unit === "cm") {
      return (number * 2.54).toFixed(1);
    }

    return value;
  };

  const handleSave = async () => {
    try {
      if (!customerId) {
        console.log("Customer ID is missing");
        return;
      }

      if (mode === "edit" && measurementId) {
        await updateMeasurement(measurementId, measurements, unit, others);

        console.log("Measurement updated successfully");
      } else {
        await addMeasurement(customerId, measurements, unit, others);

        console.log("Measurement saved successfully");
      }

      router.back();
    } catch (error) {
      console.log("Failed to save measurement:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: mode === "edit" ? t("measurementsTitle") : t("newMeasurement"),

          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },

          headerTintColor: colors.textWhite,

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
          },
        }}
      />

      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Measurement Unit */}
          <View style={styles.unitContainer}>
            <Text
              style={[
                styles.unitTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {t("unit")}
            </Text>

            <View
              style={[
                styles.unitToggle,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.unitButton,
                  unit === "inch" && [
                    styles.activeUnit,
                    {
                      backgroundColor: colors.secondaryLight,
                    },
                  ],
                ]}
                onPress={() => setUnit("inch")}
              >
                <Text
                  style={[
                    styles.unitText,
                    {
                      color: colors.textWhite,
                    },
                  ]}
                >
                  {t("inch")}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.unitButton,
                  unit === "cm" && [
                    styles.activeUnit,
                    {
                      backgroundColor: colors.secondaryLight,
                    },
                  ],
                ]}
                onPress={() => setUnit("cm")}
              >
                <Text
                  style={[
                    styles.unitText,
                    {
                      color: colors.textWhite,
                    },
                  ]}
                >
                  {t("cm")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Measurement Sections */}
          {measurementSections
            .filter((section) => section.key !== "others")
            .map((section) => {
              const isOpen = openSection === section.key;

              return (
                <View
                  key={section.key}
                  style={[
                    styles.section,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    isOpen && {
                      backgroundColor: colors.card,
                    },
                  ]}
                >
                  {/* Section Header */}
                  <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.key)}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {section.title}
                    </Text>

                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-forward"}
                      size={20}
                      color={colors.text}
                    />
                  </Pressable>

                  {isOpen && (
                    <View style={styles.fieldsContainer}>
                      {section.fields.map((field) => {
                        const value =
                          measurements[section.key]?.[field.key] || "";

                        return (
                          <View key={field.key} style={styles.inputContainer}>
                            <InputField
                              label={field.label}
                              value={convertValue(value)}
                              keyboardType="decimal-pad"
                              onChangeText={(text) =>
                                handleFieldChange(section.key, field.key, text)
                              }
                              placeholder={`${t("enter")} ${field.label.toLowerCase()}`}
                            />

                            <Text
                              style={[
                                styles.unitLabel,
                                {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              {unit === "inch" ? "in" : "cm"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}

          {/* Other Notes */}
          <View>
            <InputField
              containerStyle={[
                styles.othersInput,
                {
                  backgroundColor: colors.card,
                },
              ]}
              label={t("others")}
              placeholder={t("extraNotes")}
              multiline={true}
              value={others}
              textAlignVertical="top"
              onChangeText={setOthers}
            />
          </View>
          <Spacer40 />
          <MainButton
            title={mode === "edit" ? t("updateMeasurement") : t("save")}
            loading={false}
            onPress={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default MeasurementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 200,
  },

  unitContainer: {
    marginBottom: 16,
  },

  unitTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  unitToggle: {
    flexDirection: "row",
    borderRadius: theme.radius.large,
    padding: 3,
  },

  unitButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: theme.radius.medium,
  },

  activeUnit: {},

  unitText: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  section: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
  },

  sectionHeader: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  fieldsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  inputContainer: {
    position: "relative",
    marginBottom: 8,
  },

  othersInput: {
    minHeight: 120,
  },

  unitLabel: {
    position: "absolute",
    right: 14,
    top: 20,
    fontSize: 12,
  },

  notesInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    padding: 12,
    borderRadius: 10,
  },

  notesText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
