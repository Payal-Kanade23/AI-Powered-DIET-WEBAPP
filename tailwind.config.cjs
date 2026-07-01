/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // Defines a 25-second linear infinite animation named 'scroll'
        scroll: 'scroll 25s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          // Translates exactly -50% because your data array is duplicated
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}