import { theme } from "@/styles/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Measurements = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Measurements",
          headerStyle: {
            backgroundColor: "#0B1F3A",
          },
          headerTintColor: "#D4AF37",
          headerTitleStyle: {
            color: theme.color.primary,
            fontSize: 20,
            fontWeight: "700",
          },

          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <View style={styles.main}>
        <Text>Heloo Measurements.</Text>
      </View>
    </SafeAreaView>
  );
};

export default Measurements;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
