import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
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

import * as SQLite from "expo-sqlite";

import { closeDatabase, getDatabase, initDatabase } from "@/sqliteDB/database";

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

      const db = await getDatabase();

      // Convert the current SQLite database into binary data
      const data = await db.serializeAsync();

      const fileName = `tanposh_backup_${Date.now()}.db`;

      const backupFile = new File(Paths.cache, fileName);

      // Write database binary data to backup file
      backupFile.write(data);

      // Save last backup date
      const backupDate = new Date().toISOString();
      await AsyncStorage.setItem(LAST_BACKUP_KEY, backupDate);

      setLastBackup(backupDate);

      // Share backup file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(backupFile.uri, {
          mimeType: "application/octet-stream",
          dialogTitle: "Tanposh Database Backup",
        });
      } else {
        Alert.alert("Backup Created", "Your backup was created successfully.");
      }
    } catch (error) {
      console.log("Backup error:", error);

      Alert.alert("Backup Failed", "Unable to create database backup.");
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/octet-stream", "application/x-sqlite3", "*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const selectedFile = result.assets[0];

      if (!selectedFile?.uri) {
        Alert.alert("Restore Failed", "No backup file was selected.");
        return;
      }

      Alert.alert(
        "Restore Backup",
        "Restoring this backup will replace your current customers, orders, measurements, services and profile data. Continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              await performRestore(selectedFile.uri);
            },
          },
        ],
      );
    } catch (error) {
      console.log("Restore selection error:", error);

      Alert.alert("Restore Failed", "Unable to select the backup file.");
    }
  };

  const performRestore = async (fileUri: string) => {
    let backupDb: SQLite.SQLiteDatabase | null = null;

    try {
      setLoading(true);

      console.log("Selected backup URI:", fileUri);

      // =====================================================
      // 1. Copy selected Google Drive/document file to cache
      // =====================================================

      const cacheFileName = `restore_${Date.now()}.db`;

      const cachedBackup = new File(Paths.cache, cacheFileName);

      const selectedFile = new File(fileUri);

      // Copy the selected document into our app cache
      await selectedFile.copy(cachedBackup);

      console.log("Backup copied to cache:", cachedBackup.uri);

      // =====================================================
      // 2. Read backup as binary data
      // =====================================================

      const backupBytes = await cachedBackup.bytes();

      console.log("Backup size:", backupBytes.length);

      if (backupBytes.length === 0) {
        throw new Error("Selected backup file is empty.");
      }

      // =====================================================
      // 3. Open backup database temporarily
      // =====================================================

      backupDb = await SQLite.deserializeDatabaseAsync(backupBytes);

      console.log("Backup database opened successfully");

      // =====================================================
      // 4. Validate backup tables
      // =====================================================

      const tables = await backupDb.getAllAsync<{
        name: string;
      }>(
        `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
      `,
      );

      const tableNames = tables.map((table) => table.name);

      console.log("Backup tables:", tableNames);

      const requiredTables = [
        "users",
        "customers",
        "services",
        "orders",
        "measurements",
      ];

      const missingTables = requiredTables.filter(
        (table) => !tableNames.includes(table),
      );

      if (missingTables.length > 0) {
        throw new Error(
          `Invalid Tanposh backup. Missing tables: ${missingTables.join(", ")}`,
        );
      }

      // =====================================================
      // 5. Read all backup data BEFORE touching current DB
      // =====================================================

      const users = await backupDb.getAllAsync<{
        id: number;
        first_name: string;
        last_name: string;
        phone: string;
        password: string;
        created_at: string;
      }>("SELECT * FROM users ORDER BY id ASC");

      const customers = await backupDb.getAllAsync<{
        id: number;
        first_name: string;
        phone: string;
        due_date: string | null;
        advance_amount: number;
        address: string;
        notes: string | null;
        created_at: string;
      }>("SELECT * FROM customers ORDER BY id ASC");

      const services = await backupDb.getAllAsync<{
        id: number;
        name: string;
        icon: string | null;
        is_active: number;
        created_at: string;
      }>("SELECT * FROM services ORDER BY id ASC");

      const orders = await backupDb.getAllAsync<{
        id: number;
        order_code: string;
        customer_id: number | null;
        service_id: number | null;
        status: string;
        amount: number;
        delivery_date: string | null;
        created_at: string;
      }>("SELECT * FROM orders ORDER BY id ASC");

      const measurements = await backupDb.getAllAsync<{
        id: number;
        customer_id: number;
        measurements: string;
        unit: string;
        notes: string | null;
        created_at: string;
      }>("SELECT * FROM measurements ORDER BY id ASC");

      console.log("Backup data:", {
        users: users.length,
        customers: customers.length,
        services: services.length,
        orders: orders.length,
        measurements: measurements.length,
      });

      // =====================================================
      // 6. Close temporary backup database
      // =====================================================

      await backupDb.closeAsync();
      backupDb = null;

      // =====================================================
      // 7. Close current Tanposh database
      // =====================================================

      await closeDatabase();

      // =====================================================
      // 8. Open current Tanposh database
      // =====================================================

      const database = await getDatabase();

      // =====================================================
      // 9. Replace current data inside transaction
      // =====================================================

      await database.withExclusiveTransactionAsync(async (txn) => {
        // Delete dependent tables first
        await txn.execAsync(`
        DELETE FROM measurements;
        DELETE FROM orders;
        DELETE FROM customers;
        DELETE FROM services;
        DELETE FROM users;
      `);

        // -------------------------
        // USERS
        // -------------------------

        for (const user of users) {
          await txn.runAsync(
            `
          INSERT INTO users (
            id,
            first_name,
            last_name,
            phone,
            password,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
            user.id,
            user.first_name,
            user.last_name,
            user.phone,
            user.password,
            user.created_at,
          );
        }

        // -------------------------
        // CUSTOMERS
        // -------------------------

        for (const customer of customers) {
          await txn.runAsync(
            `
          INSERT INTO customers (
            id,
            first_name,
            phone,
            due_date,
            advance_amount,
            address,
            notes,
            created_at
          )
          VALUES (?, ?, ?, ?,?, ?, ?, ?)
          `,
            customer.id,
            customer.first_name,
            customer.phone,
            customer.due_date,
            customer.advance_amount,
            customer.address,
            customer.notes,
            customer.created_at,
          );
        }

        // -------------------------
        // SERVICES
        // -------------------------

        for (const service of services) {
          await txn.runAsync(
            `
          INSERT INTO services (
            id,
            name,
            icon,
            is_active,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
          `,
            service.id,
            service.name,
            service.icon,
            service.is_active,
            service.created_at,
          );
        }

        // -------------------------
        // ORDERS
        // -------------------------

        for (const order of orders) {
          await txn.runAsync(
            `
          INSERT INTO orders (
            id,
            order_code,
            customer_id,
            service_id,
            status,
            amount,
            delivery_date,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
            order.id,
            order.order_code,
            order.customer_id,
            order.service_id,
            order.status,
            order.amount,
            order.delivery_date,
            order.created_at,
          );
        }

        // -------------------------
        // MEASUREMENTS
        // -------------------------

        for (const measurement of measurements) {
          await txn.runAsync(
            `
          INSERT INTO measurements (
            id,
            customer_id,
            measurements,
            unit,
            notes,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
            measurement.id,
            measurement.customer_id,
            measurement.measurements,
            measurement.unit,
            measurement.notes,
            measurement.created_at,
          );
        }
      });

      // =====================================================
      // 10. Reinitialize database
      // =====================================================

      await initDatabase();

      // =====================================================
      // 11. Delete temporary cache file
      // =====================================================

      if (cachedBackup.exists) {
        cachedBackup.delete();
      }

      console.log("Database restore completed successfully");

      Alert.alert(
        "Restore Successful",
        "Your Tanposh database has been restored successfully. Please restart the app to refresh all screens.",
      );
    } catch (error: any) {
      console.log("=================================");
      console.log("RESTORE ERROR:", error);
      console.log("RESTORE MESSAGE:", error?.message);
      console.log("=================================");

      // Close temporary backup DB if something failed
      if (backupDb) {
        try {
          await backupDb.closeAsync();
        } catch (closeError) {
          console.log("Backup DB close error:", closeError);
        }
      }

      Alert.alert(
        "Restore Failed",
        error?.message || "Unable to restore the selected backup.",
      );
    } finally {
      setLoading(false);
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
                color: colors.textGold,
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
              backgroundColor: colors.textWhite,
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
