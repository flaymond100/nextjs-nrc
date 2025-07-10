import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      width: "100%",
      minWidth: "100% !important",
      maxWidth: "100% !important",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      fontFamily: {
        rubik: ["var(--font-rubik)"],
      },
      colors: {
        "custom-orange": "rgb(236 208 111)",
      },
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
        "4000": "4000ms",
        "5000": "5000ms",
        "6000": "6000ms",
        "7000": "7000ms",
        "8000": "8000ms",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
});

export default config;
