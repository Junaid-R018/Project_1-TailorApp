import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AboutScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const openEmail = () => {
    Linking.openURL("mailto:support@tanposh.com");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("aboutTanposh"),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },
          headerTintColor: colors.textWhite,
          headerTitleStyle: {
            fontWeight: "700",
          },
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / App Icon */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="shirt-outline"
              size={52}
              color={colors.secondaryLight}
            />
          </View>

          <Text style={[styles.appName, { color: colors.secondary }]}>
            TANPOSH
          </Text>

          <Text style={[styles.tagline, { color: colors.textLight }]}>
            {t("smartTailorManagement")}
          </Text>

          <View
            style={[
              styles.versionBadge,
              {
                borderColor: colors.primary,
                backgroundColor: colors.secondaryLight,
              },
            ]}
          >
            <Text style={[styles.versionText, { color: colors.primary }]}>
              {t("version")} 1.0.0
            </Text>
          </View>
        </View>

        {/* About */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.primary}
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("aboutTanposh")}
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t("aboutTanposhDescription")}
          </Text>
        </View>

        {/* Features */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="apps-outline" size={24} color={colors.primary} />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("features")}
            </Text>
          </View>

          <FeatureItem
            icon="people-outline"
            title={t("customerManagement")}
            description={t("customerManagementDescription")}
          />

          <FeatureItem
            icon="resize-outline"
            title={t("measurementManagement")}
            description={t("measurementManagementDescription")}
          />

          <FeatureItem
            icon="shirt-outline"
            title={t("orderManagement")}
            description={t("orderManagementDescription")}
          />

          <FeatureItem
            icon="calendar-outline"
            title={t("deliveryTracking")}
            description={t("deliveryTrackingDescription")}
          />

          <FeatureItem
            icon="cash-outline"
            title={t("paymentManagement")}
            description={t("paymentManagementDescription")}
          />

          <FeatureItem
            icon="server-outline"
            title={t("localStorage")}
            description={t("localStorageDescription")}
          />
        </View>

        {/* Developer */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="code-slash-outline"
              size={24}
              color={colors.primary}
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("developedBy")}
            </Text>
          </View>

          <Text style={[styles.developerName, { color: colors.text }]}>
            Tanposh Team
          </Text>

          <Text
            style={[
              styles.developerDescription,
              { color: colors.textSecondary },
            ]}
          >
            {t("developerDescription")}
          </Text>
        </View>

        {/* Support */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.primary}
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("support")}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.supportButton,
              {
                backgroundColor: colors.primary,
              },
              pressed && styles.pressed,
            ]}
            onPress={openEmail}
          >
            <Ionicons name="mail-outline" size={21} color={colors.secondary} />

            <Text
              style={[styles.supportButtonText, { color: colors.secondary }]}
            >
              {t("contactSupport")}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            © 2026 Tanposh
          </Text>

          <Text style={[styles.footerSubText, { color: colors.textLight }]}>
            {t("footerTagline")}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

type FeatureItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.featureItem}>
      <View
        style={[
          styles.featureIcon,
          {
            backgroundColor: colors.secondary,
          },
        ]}
      >
        <Ionicons name={icon} size={21} color={colors.primary} />
      </View>

      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>

        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  logoContainer: {
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
  },

  appName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },

  tagline: {
    fontSize: 14,
    marginTop: 4,
  },

  versionBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: theme.radius.round,
  },

  versionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
    borderWidth: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 9,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    flex: 1,
    marginLeft: 12,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  featureDescription: {
    fontSize: 12,
    marginTop: 2,
  },

  developerName: {
    fontSize: 16,
    fontWeight: "700",
  },

  developerDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },

  supportButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  supportButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },

  footer: {
    alignItems: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 13,
    fontWeight: "600",
  },

  footerSubText: {
    fontSize: 12,
    marginTop: 4,
  },
});
