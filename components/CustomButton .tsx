import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const CustomButton = () => {
  return (
    <View style={styles.container}>
      <Text> Custom button for app </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
