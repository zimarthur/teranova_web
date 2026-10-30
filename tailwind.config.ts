import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        blotter: "#EFF6FF",
        sheet: "#FFFFFF",
        soil: "#1B76D9",
        brass: "#1B76D9",
        pin: "#05D0EA",
        line: "#E1E1E1",
        quiet: "#4F646F",
        brand: {
          DEFAULT: "#1B76D9",
          cyan: "#05D0EA",
          deep: "#0042F8",
          aux: "#8EBEF0",
          soft: "rgba(27, 118, 217, 0.2)",
        },
        surface: "#EFF6FF",
        ink: "#000000",
        grey: {
          DEFAULT: "#4F646F",
          2: "#E1E1E1",
        },
        plan: {
          plus: "#1B76D9",
          pro: "#7C3AED",
        },
        success: "#31BD0E",
        danger: "#E74C3C",
      },
    },
  },
  plugins: [],
} satisfies Config;
