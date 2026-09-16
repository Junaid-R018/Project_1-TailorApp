import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import InputField from "@/components/inputField";
import MainButton from "@/components/MainButton ";
import { getUser, updateUserProfile } from "@/sqliteDB/auth";
import { theme } from "@/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      const savedPhone = await AsyncStorage.getItem("userPhone");

      if (!savedPhone) {
        Alert.alert(t("error"), t("somethingWentWrong"));
        return;
      }

      setPhone(savedPhone);

      const user = await getUser(savedPhone);

      if (user) {
        setFirstName(user.First_Name);
        setLastName(user.Last_Name);
      }
    } catch (error) {
      console.log("Failed to load profile:", error);

      Alert.alert(t("error"), t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName) {
      Alert.alert(t("error"), t("firstNameRequired"));
      return;
    }

    if (!trimmedLastName) {
      Alert.alert(t("error"), t("lastNameRequired"));
      return;
    }

    try {
      setSaving(true);

      const updated = await updateUserProfile(
        phone,
        trimmedFirstName,
        trimmedLastName,
      );

      if (updated) {
        Alert.alert(t("success"), t("success"), [
          {
            text: t("ok"),
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(t("error"), t("somethingWentWrong"));
      }
    } catch (error) {
      console.log("Failed to update profile:", error);

      Alert.alert(t("error"), t("somethingWentWrong"));
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: t("editProfile"),
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
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("editProfile"),
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
        <Text
          style={[
            styles.title,
            {
              color: colors.primary,
            },
          ]}
        >
          {t("editProfile")}
        </Text>
        <View style={styles.inputWrapper}>
          <InputField
            label={t("firstName")}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t("firstName")}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            label={t("lastName")}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t("lastName")}
            autoCapitalize="words"
          />
        </View>
        <View
          style={[
            styles.phoneContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.phoneLabel,
              {
                color: colors.primary,
              },
            ]}
          >
            {t("phoneNumber")}
          </Text>

          <Text
            style={[
              styles.phoneText,
              {
                color: colors.textNavy,
              },
            ]}
          >
            {phone}
          </Text>
        </View>
        <MainButton
          title={t("save")}
          onPress={handleSave}
          loading={saving}
          parentStyle={styles.button}
        />
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  inputWrapper: {
    marginBottom: 18,
  },

  phoneContainer: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    paddingHorizontal: 15,
    justifyContent: "center",
    marginBottom: 25,
  },

  phoneLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },

  phoneText: {
    fontSize: 16,
    fontWeight: "500",
  },

  button: {
    marginTop: 10,
  },
});
