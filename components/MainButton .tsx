import { useTheme } from "@/app/context/ThemeContext";
import { theme } from "@/styles/theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type ThemeColor = keyof typeof theme.colors.light;

interface IMainButton {
  title: string;
  onPress: () => void;
  loading: boolean;
  backgroundColor?: ThemeColor;
  parentStyle?: ViewStyle;
  btnStyle?: ViewStyle;
  disabled?: boolean;
}

const MainButton = ({
  title,
  loading,
  disabled = false,
  onPress,
  backgroundColor = "primary",
  parentStyle,
  btnStyle,
}: IMainButton) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={!loading && !disabled ? onPress : undefined}
      disabled={disabled || loading}
      style={[
        styles.parent,
        {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowRadius: 3.84,
          shadowOpacity: 0.25,
          elevation: 5,
        },
        parentStyle,
      ]}
    >
      <View
        style={[
          styles.btnContainer,
          {
            backgroundColor: disabled
              ? colors.disabledBackground
              : colors[backgroundColor],
          },
          btnStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textWhite} />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color: colors.textWhite,
              },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  parent: {
    width: "90%",
    alignSelf: "center",
    marginTop: "30%",
  },

  btnContainer: {
    borderRadius: theme.radius.medium,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    textAlign: "center",
    fontSize: theme.font.size.large,
    fontWeight: theme.font.weight.medium,
  },
});
