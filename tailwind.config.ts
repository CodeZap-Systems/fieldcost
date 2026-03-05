import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f8f4",
          100: "#e2efe3",
          200: "#c9e0cc",
          300: "#a3ccb0",
          400: "#7db392",
          500: "#5a9b78",
          600: "#3f7b5e",
          700: "#2f5f49",
          800: "#244b3a",
          900: "#1d3b2d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
