import { measurementSections } from "@/Utils/measurementData";
import MainButton from "@/components/MainButton ";
import InputField from "@/components/inputField";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  const params = useLocalSearchParams();
  const mode = params.mode === "new" ? "new" : "edit";
  const [unit, setUnit] = useState<Unit>("inch");
  const [openSection, setOpenSection] = useState("shirt");
  const [measurements, setMeasurements] =
    useState<Measurements>(emptyMeasurements);
  const [others, setOthers] = useState("");

  const updateMeasurement = (
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

  const handleUpdate = () => {
    console.log("Measurements:", measurements);

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: mode === "edit" ? " Measurements" : "New Measurements",

          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },
          headerTintColor: theme.color.textWhite,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
          },
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.unitContainer}>
            <Text style={styles.unitTitle}>Measurement Unit</Text>

            <View style={styles.unitToggle}>
              <Pressable
                style={[
                  styles.unitButton,
                  unit === "inch" && styles.activeUnit,
                ]}
                onPress={() => setUnit("inch")}
              >
                <Text
                  style={[
                    styles.unitText,
                    unit === "inch" && styles.activeUnitText,
                  ]}
                >
                  Inches
                </Text>
              </Pressable>

              <Pressable
                style={[styles.unitButton, unit === "cm" && styles.activeUnit]}
                onPress={() => setUnit("cm")}
              >
                <Text
                  style={[
                    styles.unitText,
                    unit === "cm" && styles.activeUnitText,
                  ]}
                >
                  CM
                </Text>
              </Pressable>
            </View>
          </View>

          {measurementSections
            .filter((section) => section.key !== "others")
            .map((section) => {
              const isOpen = openSection === section.key;

              return (
                <View
                  key={section.key}
                  style={[styles.section, isOpen && styles.openSection]}
                >
                  {/* Section Header */}
                  <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.key)}
                  >
                    <Text style={styles.sectionTitle}>{section.title}</Text>

                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-forward"}
                      size={20}
                      color={theme.color.text}
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
                                updateMeasurement(section.key, field.key, text)
                              }
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                            <Text style={styles.unitLabel}>
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
          <View>
            <InputField
              containerStyle={styles.othersInput}
              label="Others"
              placeholder="Extra notes"
              multiline={true}
              value={others}
              textAlignVertical="top"
              onChangeText={setOthers}
            />
          </View>
          <MainButton
            title={
              mode === "edit" ? "Update Measurements" : "Save Measurements"
            }
            loading={false}
            onPress={handleUpdate}
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
    backgroundColor: theme.color.background,
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
    color: theme.color.textNavy,
    marginBottom: 8,
  },

  unitToggle: {
    flexDirection: "row",
    backgroundColor: theme.color.primary,
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

  activeUnit: {
    backgroundColor: theme.color.secondaryLight,
  },

  unitText: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
    color: theme.color.textWhite,
  },

  activeUnitText: {
    color: theme.color.textWhite,
  },

  section: {
    backgroundColor: theme.color.textWhite,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  openSection: {
    backgroundColor: theme.color.textWhite,
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
    color: theme.color.textNavy,
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
    backgroundColor: theme.color.textWhite,
  },
  unitLabel: {
    position: "absolute",
    right: 14,
    top: 20,
    fontSize: 12,
    color: "#777",
  },

  notesInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFFDF5",
  },

  notesText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
});
