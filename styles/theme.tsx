// theme.ts

export const theme = {
  // =====================================================
  // COLORS
  // =====================================================
  color: {
    // Brand Colors
    primary: "#D4AF37", // Gold
    primaryDark: "#B8860B", // darkgold
    primaryLight: "#F4E3A1", //lightgold

    secondary: "#0B1F3A", // Navy Blue
    secondaryDark: "#061426", // darknavyblue
    secondaryLight: "#193A63", // lightnavyblue

    // Background Colors
    background: "#F8F8F8", ///light white
    backgroundLight: "#FFFFFF", // white
    backgroundDark: "#F0F0F0", //gray white

    // Text Colors
    text: "#000000", /// black
    textSecondary: "#666666", // medium  gray
    textLight: "#999999", // gray
    textWhite: "#FFFFFF", // text white
    textGold: "#D4AF37", //textGold
    textNavy: "#0B1F3A", //textNavy

    // Status Colors
    success: "#2E7D32", // light green
    successLight: "#E8F5E9", //green white

    warning: "#ED6C02", // oringe
    warningLight: "#FFF3E0", // light pink

    error: "#D32F2F", // red
    errorLight: "#FFEBEE", // light red

    info: "#1976D2", // light blue
    infoLight: "#E3F2FD", // skyblue

    // UI Colors
    border: "#E0E0E0", // light gray
    divider: "#EEEEEE", // x- light gray
    card: "#FFFFFF", // white
    input: "#FFFFFF", // white

    disabled: "#BDBDBD",
    disabledBackground: "#EEEEEE",

    overlay: "rgba(0, 0, 0, 0.5)",
    transparent: "transparent",
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
