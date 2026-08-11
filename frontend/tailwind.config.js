import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'Lora', 'serif'],
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FDFBF7", // Crema suave
            foreground: "#11181C", // Gris muy oscuro (casi negro)
            primary: {
              DEFAULT: "#E17055", // Terracota moderno
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#F3E8D6", // Acento beige
              foreground: "#11181C",
            },
          }
        },
        dark: {
          colors: {
            background: "#161615", // Gris carbón
            foreground: "#EDEDED",
            primary: {
              DEFAULT: "#E17055", // Terracota moderno
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#2A2A28",
              foreground: "#EDEDED",
            },
          }
        }
      }
    })
  ],
}
