/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Blue Finance Theme
        finance: {
          dark: "#1A2B42", // Primary Background Blue
          primary: "#3B7DF1", // Accent/Button Blue
          accentBlue: "#3B7DF1",
          light: "#F8F8F8", // Text/Icon Color (White/Light Off-White)
          secondary: "#A9B4C2", // Secondary Text/Subtle Elements
          surface: "#2A3B52", // Card/Component Background (lighter than dark)
          card: "#2B3E57", // New card background
          border: "#3D4F66", // Border Color (between surface and secondary)
          hover: "#4A8BF2", // Hover state for primary buttons
          success: "#10B981", // Success/Positive amounts
          danger: "#EF4444", // Danger/Negative amounts
          warning: "#F59E0B", // Warning/Neutral states
          muted: "#C9D1D9", // Improved muted text for dark backgrounds
          lightText: "#F8F8F8", // Alias for clarity
          secondaryText: "#A9B4C2", // Alias for clarity
          cardBg: "#abb9c7", // Main background color for body
        },
      },
    },
  },
  plugins: [],
};
