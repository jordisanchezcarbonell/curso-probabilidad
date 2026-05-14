import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: "#1c1c1c",
        paper: "#f5f1ea",
        accent: "#c8102e",
        rule: "rgba(28, 28, 28, 0.12)",
        muted: "rgba(28, 28, 28, 0.6)",
        faint: "rgba(28, 28, 28, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
