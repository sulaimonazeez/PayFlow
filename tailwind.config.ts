import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1729",
        primary: {
          DEFAULT: "#152A4E",
          light: "#22406F",
          dark: "#0B1A33",
        },
        accent: {
          DEFAULT: "#E8A33D",
          light: "#F2BD6B",
          dark: "#C9832A",
        },
        success: "#1F9D63",
        danger: "#D64545",
        warning: "#E8A33D",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8FB",
          border: "#E7E9F0",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1',
      },
      borderRadius: {
        card: "1.25rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 41, 0.04), 0 8px 24px rgba(15, 23, 41, 0.06)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
