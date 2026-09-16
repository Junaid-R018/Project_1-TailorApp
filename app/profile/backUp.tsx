import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { getDatabase } from "@/sqliteDB/database";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { Stack } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LAST_BACKUP_KEY = "lastBackupDate";

export default function BackupScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    loadLastBackup();
  }, []);

  const loadLastBackup = async () => {
    try {
      const date = await AsyncStorage.getItem(LAST_BACKUP_KEY);

      if (date) {
        setLastBackup(date);
      }
    } catch (error) {
      console.log("Failed to load backup date:", error);
    }
  };

  const createBackup = async () => {
    try {
      setLoading(true);

      // Make sure database is initialized
      await getDatabase();

      /*
       * expo-sqlite stores the database in the app's SQLite directory.
       * We obtain the database directory from the SQLite database object.
       */
      const db = await getDatabase();

      // Flush pending SQLite operations
      await db.execAsync("PRAGMA wal_checkpoint(FULL);");

      const databasePath = db.databasePath;

      if (!databasePath) {
        throw new Error("Database path not found");
      }

      const sourceFile = new File(databasePath);

      if (!sourceFile.exists) {
        throw new Error("Database file does not exist");
      }

      const date = new Date();

      const fileDate = date
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("T", "_")
        .slice(0, 19);

      const backupFile = new File(Paths.cache, `tanposh_backup_${fileDate}.db`);

      sourceFile.copy(backupFile);

      await AsyncStorage.setItem(LAST_BACKUP_KEY, date.toISOString());

      setLastBackup(date.toISOString());

      // Open system share/save sheet
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(backupFile.uri, {
          dialogTitle: t("backupRestore"),
          mimeType: "application/octet-stream",
          UTI: "public.database",
        });
      } else {
        Alert.alert(t("success"), "Backup created successfully.");
      }
    } catch (error) {
      console.log("Backup error:", error);

      Alert.alert(t("error"), "Unable to create database backup.");
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/octet-stream", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedFile = result.assets[0];

      Alert.alert(
        "Restore Backup",
        "Restoring this backup will replace your current Tanposh database. Continue?",
        [
          {
            text: t("cancel"),
            style: "cancel",
          },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);

                const db = await getDatabase();

                await db.execAsync("PRAGMA wal_checkpoint(FULL);");

                const databasePath = db.databasePath;

                if (!databasePath) {
                  throw new Error("Database path not found");
                }

                const currentDatabase = new File(databasePath);
                const backupFile = new File(selectedFile.uri);

                if (!backupFile.exists) {
                  throw new Error("Selected backup does not exist");
                }

                backupFile.copy(currentDatabase);

                Alert.alert(
                  t("success"),
                  "Backup restored successfully. Please restart Tanposh.",
                );
              } catch (error) {
                console.log("Restore error:", error);

                Alert.alert(
                  t("error"),
                  "Unable to restore the selected backup.",
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ],
      );
    } catch (error) {
      console.log("Document picker error:", error);

      Alert.alert(t("error"), "Unable to select backup file.");
    }
  };

  const formatBackupDate = (date: string | null) => {
    if (!date) {
      return "No backup created yet";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("backupRestore"),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },
          headerTintColor: colors.textWhite,
          headerTitleStyle: {
            color: colors.textWhite,
            fontWeight: "700",
          },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={35}
              color={colors.secondary}
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.textNavy,
              },
            ]}
          >
            {t("backupRestore")}
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: colors.textLight,
              },
            ]}
          >
            Protect your customers, measurements, orders and other Tanposh data
            by creating a backup.
          </Text>
        </View>

        {/* Last Backup */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="time-outline" size={24} color={colors.primary} />

          <View style={styles.infoContent}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: colors.textNavy,
                },
              ]}
            >
              Last Backup
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textLight,
                },
              ]}
            >
              {formatBackupDate(lastBackup)}
            </Text>
          </View>
        </View>

        {/* Create Backup */}
        <Pressable
          onPress={createBackup}
          disabled={loading}
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: loading ? 0.6 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.secondary} />
            ) : (
              <Ionicons
                name="cloud-upload-outline"
                size={28}
                color={colors.secondary}
              />
            )}
          </View>

          <View style={styles.actionContent}>
            <Text
              style={[
                styles.actionTitle,
                {
                  color: colors.textNavy,
                },
              ]}
            >
              Create Backup
            </Text>

            <Text
              style={[
                styles.actionDescription,
                {
                  color: colors.textLight,
                },
              ]}
            >
              Create a copy of your Tanposh database.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color={colors.textLight} />
        </Pressable>

        {/* Restore Backup */}
        <Pressable
          onPress={restoreBackup}
          disabled={loading}
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: loading ? 0.6 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: colors.secondaryLight,
              },
            ]}
          >
            <Ionicons
              name="cloud-download-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.actionContent}>
            <Text
              style={[
                styles.actionTitle,
                {
                  color: colors.textNavy,
                },
              ]}
            >
              Restore Backup
            </Text>

            <Text
              style={[
                styles.actionDescription,
                {
                  color: colors.textLight,
                },
              ]}
            >
              Restore your Tanposh database from a backup file.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color={colors.textLight} />
        </Pressable>

        {/* Warning */}
        <View
          style={[
            styles.warningCard,
            {
              backgroundColor: colors.disabledBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primaryDark}
          />

          <Text
            style={[
              styles.warningText,
              {
                color: colors.textNavy,
              },
            ]}
          >
            Restoring a backup can replace your current customer, measurement
            and order data. Always create a new backup before restoring an older
            one.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  infoCard: {
    minHeight: 75,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
  },

  actionCard: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  actionIcon: {
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  actionContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },

  warningCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    padding: 15,
    marginTop: 5,
  },

  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },
});
