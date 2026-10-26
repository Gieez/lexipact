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
        lexi: {
          bg: "#0a0c10",
          card: "#11141a",
          cardHover: "#161b24",
          border: "#232834",
          borderStrong: "#374151",
          parchment: "#f3f1ea",
          parchmentMuted: "#9ca3af",
          gold: "#d97706",
          goldHover: "#b45309",
          goldLight: "#f59e0b",
          goldMuted: "rgba(217, 119, 6, 0.12)",
          emerald: "#10b981",
          emeraldMuted: "rgba(16, 185, 129, 0.12)",
          crimson: "#ef4444",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        seal: "0 0 0 1px #d97706, 0 4px 20px -2px rgba(217, 119, 6, 0.2)",
        docket: "0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px #232834",
        verified: "0 0 0 1px #10b981, 0 4px 20px -2px rgba(16, 185, 129, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
