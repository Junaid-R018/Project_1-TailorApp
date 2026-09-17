import { useTheme } from "@/app/context/ThemeContext";
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
      containerStyle,
      rightIcon,
      onRightIconPress,
      ...inputProps
    },
    ref,
  ) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
            containerStyle,
          ]}
        >
          <View
            style={[
              styles.labelContainer,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}
            >
              {label}
            </Text>
          </View>

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
              },
              style,
            ]}
            placeholderTextColor={colors.textLight}
            {...inputProps}
          />

          {rightIcon && (
            <Pressable style={styles.iconButton} onPress={onRightIconPress}>
              <Ionicons name={rightIcon} size={22} color={colors.textGold} />
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
    // marginBottom: 15,
  },

  inputContainer: {
    position: "relative",
    width: "100%",
    height: 52,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: theme.radius.large,
    elevation: 5,
    backgroundColor: theme.colors.light.divider,

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
    zIndex: 10,
    borderRadius: theme.radius.medium,
  },

  label: {
    fontSize: theme.font.size.small,
    fontWeight: "400",
  },

  input: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.large,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.light.divider,
    fontSize: 15,
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
