import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Splashscreen = () => {
  return (
    <View style={styles.container}>
      <Text> textInComponent </Text>
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
