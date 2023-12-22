/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        accent: "#15B16D",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        backgroundPrimary: "#FBFEFC",
        backgroundSecondary: "#FEFEF6",
        backgroundTertiary: "#9ADFC1",
        backgroundQuarternary: "#04027B0D",
        cardShade: "#FEFEF6",
        headingPrimary: "#15B16D",
        headingSecondary: "#2A1D10",
        basedDark: "#08120D",
      },
      spacing: {
        tiny: "0.125rem", //2px
        small: "0.25rem", //4px
        medium: "0.5rem", //8px
        large: "1rem", //16px
        xLarge: "1.25rem", //20px
        xxLarge: "1.5rem", //24px
        xxxLarge: "2.25rem", //36px
        huge: "3rem", //48px
        xHuge: "4rem", //64px
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: 0,
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
