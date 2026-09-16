import { useTheme } from "@/app/context/ThemeContext";
import { Service } from "@/sqliteDB/services";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  service: Service;
};

const ServiceCard = ({ service }: Props) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.secondaryLight,
          },
        ]}
      >
        <Ionicons name={service.icon as any} size={36} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.itemName,
            {
              color: colors.text,
            },
          ]}
        >
          {service.name}
        </Text>
      </View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 114,
    marginTop: 10,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.large,
    padding: 15,
    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  container: {
    width: 65,
    height: 65,
    borderRadius: theme.radius.large,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  itemName: {
    fontSize: 16,
    fontWeight: "700",
  },
});
