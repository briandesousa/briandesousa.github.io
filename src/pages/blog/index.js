import * as React from "react"
import { graphql } from "gatsby";

export default function BlogIndexPage ({ data }) {
    const { allMarkdownRemark } = data;
    const allBlogEntries = allMarkdownRemark.edges;

    const basePath = '/blog/';
    const toc = allBlogEntries.map((blogEntry, i) => (
        <div key={i}>
            <a href={basePath + blogEntry.node.frontmatter.slug}>
                {blogEntry.node.frontmatter.title}
            </a>
        </div>
    ));

    return (
        <>{toc}</>
    );
};

export const query = graphql`
    query {
        allMarkdownRemark {
            edges {
                node {
                    tableOfContents
                    frontmatter {
                        title
                        slug
                    }
                }
            }
        }
    }
`;