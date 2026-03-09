module.exports = {
  style: {
    postcss: {
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions.plugins = [
          require("tailwindcss")("./tailwind.config.js"), // Manually point to the file
          require("autoprefixer"),
        ];
        return postcssLoaderOptions;
      },
    },
  },
};
