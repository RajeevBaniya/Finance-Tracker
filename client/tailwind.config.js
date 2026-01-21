
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        finance: {
          dark: "#1A2B42",
          primary: "#3B7DF1",
          accentBlue: "#3B7DF1",
          light: "#F8F8F8",
          secondary: "#A9B4C2",
          surface: "#0F172A",
          card: "#e4eaf0",
          border: "#3D4F66",
          hover: "#4A8BF2",
          success: "#10B981",
          danger: "#EF4444",
          warning: "#F59E0B",
          muted: "#C9D1D9",
          lightText: "#F8F8F8",
          secondaryText: "#A9B4C2",
          cardBg: "#0F172A",
        },
      },
      backgroundImage: {
        "gradient-blue-purple":
          "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
      },
    },
  },
  plugins: [],
};
