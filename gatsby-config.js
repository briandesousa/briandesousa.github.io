
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "briandesousa.github.io",
    siteUrl: "https://www.briandesousa.github.io",
    description: `GitHub.io hosted blog built with Gatsby 5`
  },
  plugins: [
  ],
};