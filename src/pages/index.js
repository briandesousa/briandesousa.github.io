import * as React from "react"

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 24,
  maxWidth: 320,
}

// markup
const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <title>briandesousa.github.io | Home</title>
      <h1 style={headingStyles}>
        <span role="img" aria-label="Book emojis">
          📗📘📕
        </span>
        briandesousa.github.io
      </h1>
      <p>a work in progress...</p>
    </main>
  )
}

export default IndexPage
