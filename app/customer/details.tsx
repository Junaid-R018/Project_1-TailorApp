import CustomerHeader from "@/components/customerHeader";
import CustomerTabs from "@/components/customerTabs";
import Measurements from "@/components/measurements";
import Orders from "@/components/orders";
import PersonalInfo from "@/components/personalInfo";
import { theme } from "@/styles/theme";
import { customer } from "@/Utils/dummyDetails";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
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
  const [modalVisible, setModalVisible] = useState(false);

  const { customerId } = useLocalSearchParams<{
    customerId: string;
  }>();

  const selectedCustomer =
    customer.find((item) => item.id.toString() === customerId) ?? customer[0];

  const [activeTab, setActiveTab] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const handleSwipe = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveTab(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Customer Details",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons
                name="ellipsis-vertical"
                size={28}
                color={theme.color.textWhite}
              />
            </Pressable>
          ),
          headerTintColor: theme.color.textWhite,
          headerTitleStyle: {
            color: theme.color.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <CustomerHeader customer={selectedCustomer} />
      <CustomerTabs activeTab={activeTab} onTabPress={handleTabPress} />
      <FlatList
        ref={listRef}
        data={[0, 1, 2]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        onMomentumScrollEnd={handleSwipe}
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
          <Pressable style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Edit Details</Text>
            <Pressable
              style={styles.editButton}
              onPress={() => {
                setModalVisible(false);
                // Open edit measurements
                // router.push("/measurements/edit");
              }}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={theme.color.textWhite}
              />

              <Text style={styles.buttonText}>Edit Measurements</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);

                // Open new measurements screen
                // router.push("/measurements/new");
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={22}
                color={theme.color.textWhite}
              />
              <Text style={styles.buttonText}>Add New Measurements</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
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
    backgroundColor: theme.color.backgroundLight,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    fontSize: theme.font.size.large,
    fontWeight: "600",
    textAlign: "center",
    color: theme.color.text,
    marginBottom: 20,
  },
  editButton: {
    width: "100%",
    height: 60,
    backgroundColor: theme.color.secondaryLight,
    borderRadius: theme.radius.round,
    borderWidth: 2,
    elevation: 4,
    borderColor: theme.color.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  modalButton: {
    width: "100%",
    height: 60,
    elevation: 4,
    backgroundColor: theme.color.secondaryLight,
    borderRadius: theme.radius.round,
    borderWidth: 2,
    borderColor: theme.color.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  buttonText: {
    color: theme.color.textWhite,
    fontSize: 16,
    fontWeight: "600",
  },
});
