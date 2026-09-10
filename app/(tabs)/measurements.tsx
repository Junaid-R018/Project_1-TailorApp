import { theme } from "@/styles/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MeasurementsScreen from "../measurement/new";

const Measurements = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Measurements",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.secondaryLight,
          },
          headerTitleStyle: {
            color: theme.color.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <View style={styles.main}>
        <MeasurementsScreen />
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
  },
});
