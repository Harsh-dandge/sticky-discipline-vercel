import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sticky: {
          yellow: '#FFD700',
          'yellow-light': '#FFE44D',
          'yellow-dark': '#E6C200',
        },
      },
      fontFamily: {
        handwritten: ['"Patrick Hand"', 'cursive'],
        handwritten2: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;
