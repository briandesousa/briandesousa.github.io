module.exports = {
  siteMetadata: {
    siteUrl: "https://www.briandesousa.github.io",
    title: "briandesousa.github.io",
  },
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: "8s9mUUTt6Xk6BKcQecSlvZDSTwcHMT0S2KjlIO5SiR0",
        spaceId: "orcrdqovc3dw",
      },
    },
  ],
};