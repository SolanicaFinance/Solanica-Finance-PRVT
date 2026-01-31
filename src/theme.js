// Theme Configuration - Dark with White Accents
export const theme = {
  colors: {
    primary: {
      main: "#000000",
      light: "#1a1a1a",
      dark: "#000000",
    },
    accent: {
      main: "#ffffff",
      light: "#f5f5f5",
      dark: "#e0e0e0",
      gradient: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
    },
    background: {
      main: "#0a0a0a",
      card: "rgba(26, 26, 26, 0.6)",
      glass: "rgba(255, 255, 255, 0.05)",
      hover: "rgba(255, 255, 255, 0.1)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
      tertiary: "#6b7280",
      accent: "#ffffff",
    },
    border: {
      main: "rgba(255, 255, 255, 0.1)",
      accent: "rgba(255, 255, 255, 0.3)",
      hover: "rgba(255, 255, 255, 0.5)",
    },
  },
  gradients: {
    primary: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
    secondary: "linear-gradient(135deg, #f5f5f5 0%, #d4d4d4 100%)",
    dark: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
    glass:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
    button: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
  },
  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
    md: "0 4px 16px rgba(0, 0, 0, 0.4)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.5)",
    glow: "0 0 20px rgba(255, 255, 255, 0.2)",
    glowStrong: "0 0 30px rgba(255, 255, 255, 0.3)",
  },
};

export default theme;
