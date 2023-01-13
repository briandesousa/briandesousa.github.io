
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `briandesousa.github.io`,
    siteUrl: `https://www.briandesousa.github.io`,
    description: `GitHub.io hosted blog built with Gatsby 5`
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/`
      }
    },
    `gatsby-transformer-remark`
  ],
};