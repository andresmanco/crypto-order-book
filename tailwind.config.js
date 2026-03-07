module.exports = {
  purge: ["./src/**/*.{js,jsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        offer: "#D24D33",
        bid: "#6AE160",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
