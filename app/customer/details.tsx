import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import CustomerHeader from "@/components/customerHeader";
import CustomerTabs from "@/components/customerTabs";
import Measurements from "@/components/measurements";
import Orders from "@/components/orders";
import PersonalInfo from "@/components/personalInfo";
import { Customer, getCustomerById } from "@/sqliteDB/customer";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CustomerDetails() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const listRef = useRef<FlatList>(null);

  const { customerId } = useLocalSearchParams<{
    customerId: string;
  }>();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) return;

      try {
        const data = await getCustomerById(Number(customerId));

        console.log("Selected Customer:", data);

        setSelectedCustomer(data);
      } catch (error) {
        console.error("Failed to load customer:", error);
      }
    };

    loadCustomer();
  }, [customerId]);

  // Loading state
  if (!selectedCustomer) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("customerDetails"),
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

        <SafeAreaView
          style={[
            styles.loadingContainer,
            { backgroundColor: colors.background },
          ]}
          edges={["left", "right", "bottom"]}
        >
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t("loading")}
          </Text>
        </SafeAreaView>
      </>
    );
  }

  const handleTabPress = (index: number) => {
    setActiveTab(index);

    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  // Swipe between tabs
  const handleSwipe = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / width);

    setActiveTab(index);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("customerDetails"),
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

          headerRight: () => (
            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={colors.textWhite}
              />
            </Pressable>
          ),

          headerShadowVisible: true,
        }}
      />

      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["left", "right", "bottom"]}
      >
        <CustomerHeader customer={selectedCustomer} />

        <CustomerTabs activeTab={activeTab} onTabPress={handleTabPress} />

        <View style={styles.content}>
          <FlatList
            ref={listRef}
            data={[0, 1, 2]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            onMomentumScrollEnd={handleSwipe}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => {
              if (item === 0) {
                return (
                  <View style={styles.page}>
                    <PersonalInfo customer={selectedCustomer} />
                  </View>
                );
              }

              if (item === 1) {
                return (
                  <View style={styles.page}>
                    <Measurements customer={selectedCustomer} />
                  </View>
                );
              }

              return (
                <View style={styles.page}>
                  <Orders customer={selectedCustomer} />
                </View>
              );
            }}
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <Pressable
              style={[
                styles.bottomSheet,
                {
                  backgroundColor: colors.backgroundLight,
                },
              ]}
              onPress={(event) => event.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t("editDetails")}
              </Text>

              {/* Edit Measurements */}
              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.secondaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);

                  router.push({
                    pathname: "/measurement/new",
                    params: {
                      customerId: selectedCustomer.id.toString(),
                      mode: "edit",
                    },
                  });
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={22}
                  color={colors.textWhite}
                />

                <Text style={[styles.buttonText, { color: colors.textWhite }]}>
                  {t("editMeasurement")}
                </Text>
              </Pressable>

              {/* Add New Measurements */}
              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.secondaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);

                  router.push({
                    pathname: "/measurement/new",
                    params: {
                      customerId: selectedCustomer.id.toString(),
                      mode: "new",
                    },
                  });
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={colors.textWhite}
                />

                <Text style={[styles.buttonText, { color: colors.textWhite }]}>
                  {t("addMeasurement")}
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },

  headerButton: {
    paddingHorizontal: 4,
  },

  content: {
    flex: 1,
  },

  page: {
    width,
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  modalTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  modalButton: {
    width: "100%",
    height: 60,
    borderRadius: theme.radius.round,
    borderWidth: 2,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
