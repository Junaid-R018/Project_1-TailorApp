import { theme } from "@/styles/theme";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "./context/ThemeContext";

export default function SettingsScreen() {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Dark Mode
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {isDark
              ? "Dark appearance is enabled"
              : "Light appearance is enabled"}
          </Text>
        </View>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{
            false: "#D5D5D5",
            true: colors.primaryDark,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
  },

  row: {
    minHeight: 70,
    borderRadius: theme.radius.large,
    borderWidth: theme.borderWidth.thin,
    paddingHorizontal: theme.spacing.large,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: theme.font.size.medium,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: theme.font.size.small,
    marginTop: theme.spacing.xs,
  },
});
