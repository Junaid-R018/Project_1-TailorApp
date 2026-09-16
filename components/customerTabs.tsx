import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { theme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface CustomerTabsProps {
  activeTab: number;
  onTabPress: (index: number) => void;
}
const tabs = [
  { key: "personalInfo", label: "Personal Info" },
  { key: "customerMeasurements", label: "Measurements" },
  { key: "customerOrders", label: "Orders" },
];
export default function CustomerTabs({
  activeTab,
  onTabPress,
}: CustomerTabsProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  return (
    <View
      style={[
        styles.tabs,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {" "}
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === index ? colors.secondaryLight : colors.primary,
            },
          ]}
          onPress={() => onTabPress(index)}
        >
          {" "}
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === index
                    ? colors.textWhite
                    : colors.secondaryLight,
              },
              activeTab === index && styles.activeTabText,
            ]}
          >
            {" "}
            {tab.key === "personalInfo"
              ? t("personalInfo")
              : tab.key === "customerMeasurements"
                ? t("measurements")
                : t("orders")}{" "}
          </Text>{" "}
        </Pressable>
      ))}{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: "center" },
  tabText: { fontSize: theme.font.size.medium, fontWeight: "500" },
  activeTabText: { fontWeight: "600" },
});
