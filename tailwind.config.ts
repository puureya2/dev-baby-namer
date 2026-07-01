import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#FFF8F0",
          200: "#FFF0DC",
          300: "#FFE4C0",
          400: "#FFD4A0",
        },
        warm: {
          100: "#FDE8D0",
          200: "#FBD4B0",
          300: "#F4A26B",
          400: "#E8875A",
          500: "#D4704A",
        },
        blush: {
          100: "#FDE4E8",
          200: "#FBC8D0",
          300: "#F49BAA",
          400: "#E87088",
        },
        sage: {
          100: "#E8F0E8",
          200: "#D0E4D0",
          300: "#A8C8A8",
          400: "#7AAA7A",
          500: "#5A8A5A",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
