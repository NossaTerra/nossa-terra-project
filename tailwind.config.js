// @ts-nocheck
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
        cardHover: "#FAFAD3",
        headingPrimary: "#15B16D",
        headingSecondary: "#2A1D10",
        basedDark: "#08120D",
        priceTag: "#224636",
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"),  function ({ addUtilities }) {
    const newUtilities = {
      ".scrollbar-webkit": {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
          paddingTop: "100px",
          marginBottom: "200px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#2a1d10",
          borderRadius: "6px"
        },
        ".break-before": { "page-break-before": "always" },
        ".break-after": { "page-break-after": "always" },
        ".break-inside-avoid": { "page-break-inside": "avoid" },
      },
      ".scrollbar-webkit-big-margin": {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
          paddingTop: "100px",
          marginBottom: "262px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#2a1d10",
          borderRadius: "6px"
        },
        ".break-before": { "page-break-before": "always" },
        ".break-after": { "page-break-after": "always" },
        ".break-inside-avoid": { "page-break-inside": "avoid" },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    addUtilities(newUtilities, ["responsive", "hover"]);
  }],
};
