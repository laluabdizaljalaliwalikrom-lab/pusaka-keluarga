import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // TailAdmin Signature Palette
        primary: {
          DEFAULT: "#3C50E0",
          hover: "#2B3EC9",
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#3C50E0",
          600: "#2B3EC9",
          700: "#1D2BB8",
        },
        dark: {
          DEFAULT: "#1C2434",
          hover: "#273247",
          sidebar: "#1C2434",
          active: "#333A48",
        },
        stroke: "#E2E8F0",
        whiten: "#F1F5F9",
        whiter: "#F8FAFC",
        // Remapped pusaka to crisp neutral/slate for professional clean appearance
        pusaka: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      boxShadow: {
        default: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
        card: "0px 1px 3px rgba(0, 0, 0, 0.08)",
        dropdown: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
