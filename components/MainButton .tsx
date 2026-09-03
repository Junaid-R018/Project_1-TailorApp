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

type ThemeColor = keyof typeof theme.color;

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
              ? "#DFDFDF"
              : theme.color[backgroundColor],
          },
          btnStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.color.textWhite} />
        ) : (
          <Text style={styles.label}>{title}</Text>
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
    backgroundColor: theme.color.primary,
  },
  label: {
    textAlign: "center",
    fontSize: theme.font.size.large,
    fontWeight: theme.font.weight.medium,
    color: theme.color.textWhite,
  },
});
