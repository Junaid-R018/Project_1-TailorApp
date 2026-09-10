import { theme } from "@/styles/theme";
import { Service } from "@/Utils/dummyData";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  service: Service;
};

const getStatusColor = (status: any) => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        backgroundColor: theme.color.error,
        color: "#fff",
      };
    case "completed":
      return {
        backgroundColor: theme.color.success,
        color: "#fff",
      };
    case "ready":
      return {
        backgroundColor: theme.color.warning,
        color: "#fff",
      };
    case "new booking":
      return {
        backgroundColor: theme.color.info,
        color: "#fff",
      };

    default:
      return {
        backgroundColor: theme.color.textSecondary,
        color: "#fff",
      };
  }
};
const ServiceCard = ({ service }: Props) => {
  const status = getStatusColor(service.status);
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: status.backgroundColor },
        ]}
      >
        <Text style={[styles.statusText, { color: status.color }]}>
          {service.status}
        </Text>
      </View>
      <View style={styles.container}>
        <Ionicons
          name={service.icon as any}
          size={56}
          color={theme.color.primary}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.itemName}>{service.name}</Text>
        <Text style={styles.itemDetail}>{service.description}</Text>
        <Text style={styles.itemPrice}>{service.price}</Text>
      </View>
    </View>
  );
};

export default ServiceCard;
const styles = StyleSheet.create({
  card: {
    width: 360,
    height: 114,
    marginTop: 15,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.textWhite,
    borderRadius: theme.radius.large,
    padding: 15,
    marginRight: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    textAlign: "center",
  },
  container: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.large,
    backgroundColor: theme.color.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.color.textNavy,
  },
  itemDetail: {
    fontSize: 13,
    color: theme.color.textSecondary,
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.color.textGold,
    marginTop: 6,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    flex: 1,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.round,
  },

  statusText: {
    fontSize: theme.font.size.small,
    fontWeight: "500",
  },
});
