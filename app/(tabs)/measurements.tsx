import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MeasurementsScreen from "../measurement/new";

const Measurements = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Stack.Screen
        options={{
          title: t("measurements"),
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.secondaryLight,
          },
          headerTitleStyle: {
            color: colors.textWhite,
            fontSize: 20,
            fontWeight: "700",
          },
          headerTintColor: colors.textWhite,
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />

      <View
        style={[
          styles.main,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
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
