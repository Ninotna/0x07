module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        "10px": "10px",
        "12px": "12px",
        "14px": "14px",
        "16px": "16px",
        "18px": "18px",
        "20px": "20px",
        "24px": "24px",
        "32px": "32px",
        "44px": "44px",
        "69px": "69px",
        "50px": "50px"
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"], // Custom font for Anton
        manrope: ["Manrope", "sans-serif"], // Custom font for Manrope
      },
      colors: {
        customYellow: {
          400: "#FFD15B",
          500: "#FFD15B",
          600: "#FFD15B",
        },
        customGray: "#7A7A7A",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
