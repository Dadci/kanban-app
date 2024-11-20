/** @type {import('tailwindcss').Config} */
export default {

  safelist: [
    {
      pattern: /bg-(red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan)-(400|500|600)/,
    }
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#635FC7',
          hover: '#A8A4FF',
        },
        destructive: {
          DEFAULT: '#EA5555',
          hover: '#FF9898',
        },
        lines: {
          DEFAULT: '#E4EBFA',
          dark: '3E3F4E'
        },
        background: {
          DEFAULT: '#F4F7FD',
          dark: '20212C',
          darkCard: '#2B2C37'
        },
        text: {
          DEFAULT: '#000112',
          secondary: '#828FA3',
        },
      }
    },
  },
  plugins: [],
}

