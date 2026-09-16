// theme.ts

export const theme = {
  // =====================================================
  // DARK / LIGHT COLOR PALETTES
  // =====================================================

  colors: {
    light: {
      primary: "#D4AF37",
      primaryDark: "#B8860B",
      primaryLight: "#F4E3A1",

      secondary: "#0B1F3A",
      secondaryDark: "#061426",
      secondaryLight: "#193A63",

      background: "#F8F8F8",
      backgroundLight: "#FFFFFF",
      backgroundDark: "#F0F0F0",

      text: "#000000",
      textSecondary: "#666666",
      textLight: "#999999",
      textWhite: "#FFFFFF",
      textGold: "#D4AF37",
      textNavy: "#0B1F3A",

      success: "#2E7D32",
      successLight: "#E8F5E9",

      warning: "#ED6C02",
      warningLight: "#FFF3E0",

      error: "#D32F2F",
      errorLight: "#FFEBEE",

      info: "#1976D2",
      infoLight: "#E3F2FD",

      border: "#E0E0E0",
      divider: "#EEEEEE",
      card: "#FFFFFF",
      input: "#FFFFFF",

      disabled: "#BDBDBD",
      disabledBackground: "#EEEEEE",

      overlay: "rgba(0, 0, 0, 0.5)",
      transparent: "transparent",
    },

    dark: {
      primary: "#D4AF37",
      primaryDark: "#B8860B",
      primaryLight: "#E8D27A",
      secondary: "#0B1F3A",
      secondaryDark: "#061426",
      secondaryLight: "#193A63",
      background: "#1E1E1E",
      backgroundLight: "#F5F5F5",
      backgroundDark: "#151515",
      text: "#D4AF37",
      textSecondary: "#555555",
      textLight: "#777777",
      textWhite: "#FFFFFF",
      textGold: "#D4AF37",
      textNavy: "#0B1F3A",
      success: "#2E7D32",
      successLight: "#E8F5E9",
      warning: "#ED6C02",
      warningLight: "#FFF3E0",
      error: "#D32F2F",
      errorLight: "#FFEBEE",
      info: "#1976D2",
      infoLight: "#E3F2FD",
      border: "#D4AF37",
      divider: "#D9D9D9",
      card: "#F5F5F5",
      input: "#F5F5F5",
      disabled: "#888888",
      disabledBackground: "#444444",
      overlay: "rgba(0, 0, 0, 0.7)",
      transparent: "transparent",
    },
  },
  // =====================================================
  // FONTS
  // =====================================================
  font: {
    family: {
      regular: "Poppins-Regular",
      medium: "Poppins-Medium",
      semiBold: "Poppins-SemiBold",
      bold: "Poppins-Bold",
      extraBold: "Poppins-ExtraBold",
    },

    // Font Sizes
    size: {
      xs: 10,
      small: 14,
      medium: 16,
      large: 20,
      extralarge: 24,
      display: 36,
    },

    // Font Weights
    weight: {
      regular: "400",
      medium: "500",
      semiBold: "600",
      bold: "700",
      extraBold: "800",
      black: "900",
    },
  },

  // =====================================================
  // LINE HEIGHT
  // =====================================================
  lineHeight: {
    small: 16,
    medium: 20,
    large: 24,
    xl: 28,
    xxl: 32,
    xxxl: 38,
    huge: 42,
  },

  // =====================================================
  // SPACING
  // =====================================================
  spacing: {
    xs: 4,
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
    section: 64,
  },

  // =====================================================
  // BORDER RADIUS
  // =====================================================
  radius: {
    none: 0,
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
    xxl: 20,
    round: 999,
  },

  // =====================================================
  // BORDER WIDTH
  // =====================================================
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },

  // =====================================================
  // OPACITY
  // =====================================================
  opacity: {
    disabled: 0.5,
    light: 0.7,
    medium: 0.8,
    high: 0.9,
    full: 1,
  },
} as const;
