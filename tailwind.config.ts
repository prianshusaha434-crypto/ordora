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
        ordora: {
          ivory: "#F8F5EF",
          charcoal: "#252722",
          coral: "#D95C42",
          "coral-hover": "#C24F37",
          "coral-light": "#FAECE9",
          sage: "#8DA18A",
          "sage-light": "#E9EFE9",
          card: "#FFFFFF",
          border: "#EAE7DF",
          success: "#27865C",
          "success-light": "#EAF5EE",
          warning: "#E4A13B",
          "warning-light": "#FDF6EA",
          error: "#CF4848",
          "error-light": "#FCECEC",
          muted: "#71746B",
          subtle: "#F2EFE8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(37, 39, 34, 0.05)",
        card: "0 4px 20px rgba(37, 39, 34, 0.06)",
        hover: "0 10px 30px rgba(37, 39, 34, 0.10)",
        kds: "0 6px 24px rgba(37, 39, 34, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
