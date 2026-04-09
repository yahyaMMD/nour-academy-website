import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dentalPurple: "#2D83AD",
        lighterPurple: "#E6F4FA",
        brandCoral: "#FF4343",
        brandYellow: "#FFD740",
        brandInk: "#16384B",
      },
    },
  },
  plugins: [],
} satisfies Config;
