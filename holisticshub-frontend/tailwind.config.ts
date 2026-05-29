import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  "#f4f7f4",
          100: "#e2ece2",
          200: "#c5d9c5",
          500: "#5a8a5a",
          700: "#3d6b3d",
          900: "#1f3d1f",
        },
        warm: {
          50:  "#fdf8f3",
          100: "#f5ead8",
          500: "#c4854a",
          700: "#8f5e2e",
        },
        forest: {
          DEFAULT: "#2d5a27",
          dark:    "#1a3a15",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans:  ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;