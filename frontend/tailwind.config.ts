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
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondaryShade: "var(--secondary-shade)",
        primaryShade: "var(--primary-shade)",
      },
      boxShadow: {
        "shadow-1":
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        "nav-shadow": "rgba(17, 17, 26, 0.1) 0px 1px 0px",
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(200px, 1fr))",
        "fluid-1": "repeat(auto-fit, minmax(300px, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;
