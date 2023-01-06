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
      colors: {
        base: "#1c2326",
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#2563eb",
          success: "#147323",
          warning: "#ea580c",
          error: "#dc2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
