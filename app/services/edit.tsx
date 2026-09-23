import { useTheme } from "@/app/context/ThemeContext";
import { getAllServices, updateService } from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const serviceIcons = [
  "shirt-outline",
  "shirt",
  "briefcase-outline",
  "walk-outline",
  "person-outline",
  "body-outline",
  "diamond-outline",
  "sparkles-outline",
  "cut-outline",
  "construct-outline",
  "layers-outline",
  "pricetag-outline",
];

const EditService = () => {
  const { colors } = useTheme();

  const { serviceId } = useLocalSearchParams<{
    serviceId: string;
  }>();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("shirt-outline");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);

      const services = await getAllServices();

      const service = services.find((item) => item.id === Number(serviceId));

      if (!service) {
        Alert.alert(
          "Service Not Found",
          "The selected service could not be found.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );

        return;
      }

      setName(service.name);
      setSelectedIcon(service.icon || "shirt-outline");
      setIsActive(service.is_active === 1);
    } catch (error) {
      console.log("Failed to load service:", error);

      Alert.alert("Error", "Unable to load this service.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const serviceName = name.trim();

    if (!serviceName) {
      Alert.alert("Required", "Please enter a service name.");
      return;
    }

    try {
      setSaving(true);

      await updateService(
        Number(serviceId),
        serviceName,
        selectedIcon,
        isActive ? 1 : 0,
      );

      Alert.alert(
        "Service Updated",
        "Your service has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/services/details");
            },
          },
        ],
      );
    } catch (error) {
      console.log("Failed to update service:", error);

      Alert.alert(
        "Unable to Update",
        "The service name may already be in use.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={["top", "bottom"]}
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Edit Service
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Update your tailoring service
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Preview */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <View
            style={[
              styles.previewIcon,
              {
                backgroundColor: colors.secondaryLight,
              },
            ]}
          >
            <Ionicons
              name={selectedIcon as any}
              size={38}
              color={colors.primary}
            />
          </View>

          <View style={styles.previewInfo}>
            <Text
              style={[
                styles.previewName,
                {
                  color: colors.text,
                },
              ]}
              numberOfLines={1}
            >
              {name.trim() || "Service Name"}
            </Text>

            <Text
              style={[
                styles.previewStatus,
                {
                  color: isActive ? "#22C55E" : colors.textSecondary,
                },
              ]}
            >
              {isActive ? "Active service" : "Inactive service"}
            </Text>
          </View>
        </View>

        {/* Service Name */}
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Service Name
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.secondaryLight,
            },
          ]}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.textSecondary}
          />

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Waistcoat"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
            maxLength={40}
          />
        </View>

        {/* Icon */}
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Choose Icon
        </Text>

        <View
          style={[
            styles.iconCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={styles.iconGrid}>
            {serviceIcons.map((icon) => {
              const selected = selectedIcon === icon;

              return (
                <Pressable
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: selected
                        ? colors.secondaryLight
                        : colors.background,
                      borderColor: selected ? colors.primary : "transparent",
                    },
                  ]}
                >
                  <Ionicons
                    name={icon as any}
                    size={25}
                    color={selected ? colors.primary : colors.textSecondary}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Status */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={styles.statusInfo}>
            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor: isActive
                    ? "rgba(34, 197, 94, 0.12)"
                    : colors.background,
                },
              ]}
            >
              <Ionicons
                name={
                  isActive ? "checkmark-circle-outline" : "pause-circle-outline"
                }
                size={23}
                color={isActive ? "#22C55E" : colors.textSecondary}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.statusTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Active Service
              </Text>

              <Text
                style={[
                  styles.statusSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Show this service in new orders
              </Text>
            </View>
          </View>

          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{
              false: colors.secondaryLight,
              true: colors.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Update */}
        <Pressable
          disabled={saving}
          onPress={handleUpdate}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              opacity: saving ? 0.6 : pressed ? 0.8 : 1,
            },
          ]}
        >
          {saving ? (
            <Text
              style={[
                styles.saveText,
                {
                  color: colors.secondaryDark,
                },
              ]}
            >
              Updating...
            </Text>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color={colors.secondaryDark}
              />

              <Text
                style={[
                  styles.saveText,
                  {
                    color: colors.secondaryDark,
                  },
                ]}
              >
                Update Service
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextContainer: {
    marginLeft: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  content: {
    paddingBottom: 30,
  },

  previewCard: {
    minHeight: 100,
    borderRadius: theme.radius.large,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  previewIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  previewInfo: {
    flex: 1,
    marginLeft: 15,
  },

  previewName: {
    fontSize: 18,
    fontWeight: "700",
  },

  previewStatus: {
    fontSize: 13,
    marginTop: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },

  iconCard: {
    borderRadius: theme.radius.large,
    padding: 14,
    marginBottom: 22,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  statusCard: {
    minHeight: 78,
    borderRadius: theme.radius.large,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  statusSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  saveButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    fontSize: 16,
    fontWeight: "800",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
