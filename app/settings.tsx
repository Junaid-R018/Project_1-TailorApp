import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { isDark, colors, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const SettingRow = ({
    icon,
    title,
    subtitle,
    right,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    onPress?: () => void;
  }) => {
    const content = (
      <>
        <Stack.Screen
          options={{
            title: t("Settings"),
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.secondaryLight,
            },
            headerTintColor: colors.textWhite,
            headerTitleStyle: {
              color: colors.textWhite,
              fontSize: 20,
              fontWeight: "700",
            },
            headerTitleAlign: "center",
          }}
        />
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.leftSection}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isDark
                    ? colors.background
                    : colors.secondaryLight,
                },
              ]}
            >
              <Ionicons name={icon} size={21} color={colors.primary} />
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {title}
              </Text>

              {subtitle && (
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {right}
        </View>
      </>
    );

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Appearance */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Appearance
      </Text>

      <SettingRow
        icon="moon-outline"
        title="Dark Mode"
        subtitle={
          isDark ? "Dark appearance is enabled" : "Light appearance is enabled"
        }
        right={
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: "#D5D5D5",
              true: colors.primaryDark,
            }}
            thumbColor="#FFFFFF"
          />
        }
      />

      <SettingRow
        icon="language-outline"
        title="Language"
        subtitle={language === "en" ? "English" : "اردو"}
        right={
          <Switch
            value={language === "ur"}
            onValueChange={toggleLanguage}
            trackColor={{
              false: "#D5D5D5",
              true: colors.primaryDark,
            }}
            thumbColor="#FFFFFF"
          />
        }
      />

      {/* Notifications */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Notifications
      </Text>

      <SettingRow
        icon="notifications-outline"
        title="Notifications"
        subtitle={
          notificationsEnabled
            ? "Notifications are enabled"
            : "Notifications are disabled"
        }
        right={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{
              false: "#D5D5D5",
              true: colors.primaryDark,
            }}
            thumbColor="#FFFFFF"
          />
        }
      />

      {/* Account */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Account
      </Text>

      <SettingRow
        icon="lock-closed-outline"
        title="Forgot Password"
        subtitle="Reset your account password"
        onPress={() => router.push("/(auth)/forget_password")}
        right={
          <Ionicons
            name="chevron-forward"
            size={21}
            color={colors.textSecondary}
          />
        }
      />

      {/* Data */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Data & Backup
      </Text>

      <SettingRow
        icon="cloud-upload-outline"
        title="Backup & Restore"
        subtitle="Backup or restore your Tanposh data"
        onPress={() => router.push("/profile/backUp")}
        right={
          <Ionicons
            name="chevron-forward"
            size={21}
            color={colors.textSecondary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
  },

  sectionTitle: {
    fontSize: theme.font.size.small,
    fontWeight: "600",
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
    textTransform: "uppercase",
  },

  row: {
    minHeight: 74,
    borderRadius: theme.radius.large,
    borderWidth: theme.borderWidth.thin,
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.small,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.medium,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: theme.font.size.small,
    marginTop: theme.spacing.xs,
  },
});
