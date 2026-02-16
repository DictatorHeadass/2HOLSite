import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        town: {
          950: '#1a1816', // Deep warm black
          900: '#2c2621', // Dark soil
          800: '#463b32', // Dark wood
          700: '#5d4f43', // Wood
          600: '#8c735a', // Light wood/dust
          500: '#b08d6b', // Sand/Parchment dark
          400: '#d4c5a9', // Parchment
          300: '#e6dec8', // Light Parchment
          200: '#f2eee3', // Paper
          100: '#f9f7f1', // Light Paper
        },
        rust: {
          500: '#c2410c', // Standard rust
          600: '#9a3412', // Darker rust
        },
        gold: {
          500: '#d97706', // Amber gold
          400: '#fbbf24', // Bright gold
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/paper-noise.png')", // Placeholder if we had one, but we'll use noise via CSS
      }
    },
  },
  plugins: [],
};
export default config;
