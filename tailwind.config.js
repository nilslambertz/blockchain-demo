/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial"],
      },
      fontSize: {
        "2xs": "0.7rem",
      },
    },
  },
  plugins: [],
};
