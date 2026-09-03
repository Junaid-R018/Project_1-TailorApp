import { theme } from "@/styles/theme";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

type InputFieldProps = TextInputProps & { label: string };

const InputField = forwardRef<TextInput, InputFieldProps>(
  ({ label, style, ...inputProps }, ref) => (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        placeholderTextColor={theme.color.textLight}
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  ),
);

InputField.displayName = "InputField";
export default InputField;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    marginTop: theme.spacing.medium,
  },
  label: {
    position: "absolute",
    zIndex: 1,
    top: -9,
    left: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    borderRadius: theme.radius.small,
    backgroundColor: theme.color.backgroundDark,
    color: theme.color.textSecondary,
    fontSize: theme.font.size.small,
    lineHeight: theme.lineHeight.medium,
  },
  input: {
    minHeight: 52,
    elevation: 5,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.color.border,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    color: theme.color.text,
    backgroundColor: theme.color.input,
    fontSize: theme.font.size.medium,
  },
});
