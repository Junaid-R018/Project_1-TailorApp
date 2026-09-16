import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { getUser } from "@/sqliteDB/auth";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PROFILE_IMAGE_KEY = "profileImage";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  useEffect(() => {
    loadProfileImage();
    loadUserProfile();
  }, []);

  const loadProfileImage = async () => {
    try {
      const image = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);

      if (image) {
        setProfileImage(image);
      }
    } catch (error) {
      console.log("Failed to load profile image:", error);
    }
  };
  const loadUserProfile = async () => {
    try {
      const savedPhone = await AsyncStorage.getItem("userPhone");

      if (!savedPhone) {
        return;
      }

      const user = await getUser(savedPhone);

      if (user) {
        setOwnerName(`${user.First_Name} ${user.Last_Name}`);
      }
    } catch (error) {
      console.log("Failed to load user Name:", error);
    }
  };

  const selectProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(t("permissionRequired"), t("galleryPermissionRequired"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        setProfileImage(imageUri);

        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, imageUri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  const handleLogout = () => {
    setMenuVisible(false);

    Alert.alert(t("logout"), t("logoutConfirmation"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("isLoggedIn");

          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleMenuPress = (action: string) => {
    setMenuVisible(false);

    switch (action) {
      case "edit":
        router.push("/profile/edit");
        break;

      case "password":
        router.push("/(auth)/forget_password");
        break;

      case "backup":
        router.push("/profile/backUp");
        break;

      case "logout":
        handleLogout();
        break;
    }
  };

  const profileOptions = [
    {
      title: t("measurements"),
      icon: "body-outline",
      route: "/measurements",
    },
    {
      title: t("payments"),
      icon: "wallet-outline",
      route: "/payments",
    },
    {
      title: t("notifications"),
      icon: "notifications-outline",
      route: "/Notifications",
    },
    {
      title: t("settings"),
      icon: "settings-outline",
      route: "/settings",
    },
    {
      title: t("language"),
      icon: "language-outline",
      route: "/LanguageContext",
    },
    {
      title: t("backupRestore"),
      icon: "cloud-upload-outline",
      route: "/profile/backUp",
    },
    {
      title: t("aboutTanposh"),
      icon: "information-circle-outline",
      route: "/about",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("profileTitle"),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },
          headerTintColor: colors.textWhite,

          headerRight: () => (
            <Pressable
              onPress={() => setMenuVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={23}
                color={colors.textWhite}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Profile Header */}
        <View
          style={[
            styles.profileSection,
            { backgroundColor: colors.secondaryLight },
          ]}
        >
          <Pressable onPress={selectProfileImage} style={styles.imageWrapper}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  {
                    backgroundColor: colors.disabledBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="person" size={55} color={colors.secondary} />
              </View>
            )}
            <View
              style={[
                styles.cameraButton,
                {
                  backgroundColor: colors.primaryDark,
                  borderColor: colors.card,
                },
              ]}
            >
              <Ionicons name="camera" size={17} color={colors.textWhite} />
            </View>
          </Pressable>

          <Text style={[styles.name, { color: colors.primary }]}>
            {ownerName}
          </Text>

          <Text style={[styles.subtitle, { color: colors.primary }]}>
            Tailor Shop Owner
          </Text>

          <Pressable
            onPress={selectProfileImage}
            style={styles.changePhotoButton}
          >
            <Ionicons
              name="image-outline"
              size={16}
              color={colors.primaryDark}
            />

            <Text
              style={[styles.changePhotoText, { color: colors.primaryDark }]}
            >
              {t("changeProfilePhoto")}
            </Text>
          </Pressable>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: colors.textWhite,
                },
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.secondaryLight,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={[styles.optionText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Top-right menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            {
              backgroundColor: "rgba(0,0,0,0.25)",
            },
          ]}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: colors.textWhite,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <Pressable
              style={styles.menuItem}
              onPress={() => handleMenuPress("edit")}
            >
              <Ionicons name="person-outline" size={20} color={colors.text} />

              <Text style={[styles.menuText, { color: colors.text }]}>
                {t("editProfile")}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleMenuPress("password")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.text}
              />

              <Text style={[styles.menuText, { color: colors.text }]}>
                {t("changePassword")}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleMenuPress("backup")}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={colors.text}
              />

              <Text style={[styles.menuText, { color: colors.text }]}>
                {t("backupRestore")}
              </Text>
            </Pressable>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            <Pressable
              style={styles.menuItem}
              onPress={() => handleMenuPress("logout")}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error} />

              <Text style={[styles.menuText, { color: colors.error }]}>
                {t("logout")}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },

  headerButton: {
    marginRight: 12,
    padding: 6,
  },

  profileSection: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 25,
  },

  imageWrapper: {
    width: 125,
    height: 125,
    borderRadius: 63,
    position: "relative",
    marginBottom: 12,
  },

  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 63,
  },

  imagePlaceholder: {
    width: 125,
    height: 125,
    borderRadius: 63,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  cameraButton: {
    position: "absolute",
    right: 3,
    bottom: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  changePhotoText: {
    fontSize: 13,
    fontWeight: "600",
  },

  optionsContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },

  option: {
    minHeight: 58,
    borderRadius: 10,
    marginBottom: 9,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  optionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 65,
    paddingRight: 12,
  },

  menu: {
    width: 230,
    borderRadius: 12,
    paddingVertical: 8,

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  menuItem: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuText: {
    fontSize: theme.font.size.small,
    fontWeight: "600",
  },

  menuDivider: {
    height: 1,
    elevation: 5,
  },
});
