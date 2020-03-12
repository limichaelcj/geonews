import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.org/docs/use-static-query/
 */

/*
 * This component is refactored from gatsby-starter-default to serve dynamic
 * image paths. It is convenient for development, but inefficient for production
 * because it always queries ALL images in the images folder.
 */

const allImageQuery = graphql`
  query {
    images: allFile(filter: { sourceInstanceName: { eq: "images" }}) {
      nodes {
        relativePath
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

const Image = ({ filename, alt }) => (
  <StaticQuery
    query={allImageQuery}
    render={data => {
      const image = data.images.nodes.find(n => n.relativePath === filename);
      if (!image) {
        return null;
      }
      return <Img fluid={image.childImageSharp.fluid} alt={alt} />;
    }}
  />
);

export default Image;
