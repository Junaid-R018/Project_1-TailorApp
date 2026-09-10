import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
};
const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      label,
      style,
      containerStyle, // 👈 ADD THIS
      rightIcon,
      onRightIconPress,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <View style={styles.container}>
        {/* 👇 APPLY containerStyle HERE */}
        <View style={[styles.inputContainer, containerStyle]}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
          </View>

          <TextInput ref={ref} style={[styles.input, style]} {...inputProps} />

          {rightIcon && (
            <Pressable style={styles.iconButton} onPress={onRightIconPress}>
              <Ionicons
                name={rightIcon}
                size={22}
                color={theme.color.textGold}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },

  inputContainer: {
    position: "relative",
    width: "100%",
    height: 52, // default height

    backgroundColor: theme.color.background,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: 8,
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  labelContainer: {
    position: "absolute",
    left: 8,
    top: -9,

    paddingHorizontal: 5,

    backgroundColor: theme.color.disabledBackground,

    zIndex: 10,
  },

  label: {
    fontSize: theme.font.size.small,
    fontWeight: "400",
    color: theme.color.text,
  },

  input: {
    width: "100%",
    height: "100%",

    paddingHorizontal: 15,
    paddingRight: 55,

    fontSize: 15,
    color: theme.color.text,
  },

  iconButton: {
    position: "absolute",
    right: 5,
    top: 0,

    height: 50,
    width: 45,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
  },
});
