import { theme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CustomerTabsProps {
  activeTab: number;
  onTabPress: (index: number) => void;
}

const tabs = ["Personal Info", "Measurements", "Orders"];

export default function CustomerTabs({
  activeTab,
  onTabPress,
}: CustomerTabsProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab}
          style={[styles.tab, activeTab === index && styles.activeTab]}
          onPress={() => onTabPress(index)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.activeTabText,
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderColor: "#999",
  },

  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: theme.color.primary,
  },

  activeTab: {
    backgroundColor: theme.color.secondaryLight,
  },

  tabText: {
    fontSize: theme.font.size.medium,
    fontWeight: "500",
    color: theme.color.secondaryLight,
  },

  activeTabText: {
    color: theme.color.textWhite,
    fontWeight: "600",
  },
});
