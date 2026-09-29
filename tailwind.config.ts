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
        canvas: "#FBFBFA",
        surface: "#FFFFFF",
        "surface-border": "#E5E7EB",
        sage: "#D8EADF",
        "sage-border": "#B8D8C5",
        "sage-deep": "#1E4D38",
        gold: "#FEF3D6",
        "gold-border": "#FCE6A8",
        "gold-deep": "#8D6B1B",
        charcoal: "#111827",
        "slate-sub": "#4B5563",
        "slate-muted": "#6B7280",
      },
      borderRadius: {
        card: "1.25rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(17, 24, 39, 0.06), 0 8px 15px -6px rgba(17, 24, 39, 0.04)",
        "card-hover": "0 22px 45px -5px rgba(17, 24, 39, 0.12), 0 12px 20px -6px rgba(17, 24, 39, 0.08)",
        button: "0 8px 20px -4px rgba(212, 175, 55, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
