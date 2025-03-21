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
        primaryShade: "var(--primary-shade)",
        primaryShadeLight: "var(--primary-shade-light)",
        secondaryShade: "var(--secondary-shade)",
        secondaryShadeDark: "var(--secondary-shade-dark)",
        blackShade: "var(--black-shade)",
        grayShade: "var(--gray-shade)",
        yellowShade: "var(--yellow-shade)",
        inputGrayShade: "var(--input-gray-shade)",
      },
      boxShadow: {
        "shadow-1": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        "nav-shadow": "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        "home-video-gif-shadow": "0px 0px 102px -6px rgba(255,255,255,1)",
      },
      backgroundImage: {
        "carousel-image-right":
          "linear-gradient(to right, rgba(0, 0, 0, 0.3),rgba(248, 251, 255, 0))",
        "carousel-image-left":
          "linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(248, 251, 255, 0))",
        "news-letter-shape-2":
          "-webkit-linear-gradient(90deg, rgba(83, 83, 83, 0) 0%, rgb(116, 116, 116) 100%)",
        "news-letter-shape-3":
          "-webkit-linear-gradient(90deg, rgba(108, 108, 108, 0) 0%, rgb(116, 116, 116) 100%)",
      },
      keyframes: {
        growFill: {
          "0%": {
            top: "100%",
            "border-top-right-radius": "100%",
            "border-top-left-radius": "100%",
          },
          "100%": {
            top: "0px",
            "border-top-right-radius": "6px",
            "border-top-left-radius": "6px",
          },
        },
        shrinkFill: {
          "0%": {
            top: "0px",
            "border-top-right-radius": "6px",
            "border-top-left-radius": "6px",
          },
          "100%": {
            top: "100%",
            "border-top-right-radius": "100%",
            "border-top-left-radius": "100%",
          },
        },
      },
      animation: {
        growFill: "growFill 0.5s ease-out forwards",
        shrinkFill: "shrinkFill 0.5s ease-out forwards",
      },
      screens: {
        xsm: "450px",
        xmd: "930px",
      },
      gridTemplateColumns: {
        "project-grid-mobile": "repeat(auto-fit, minmax(220px, 1fr))",
        "project-grid-desktop": "repeat(auto-fit, minmax(450px, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;
