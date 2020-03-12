import React from 'react';
import { Link } from 'gatsby';
import Image from '../components/image';
import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Gatsby Starter Basic" />
    <div style={{width: 100, marginBottom: '1rem'}}>
      <Image filename="gatsby-icon.png" />
    </div>
    <h1>Gatsby Starter Basic</h1>
    <p>Welcome to your new Gatsby site.</p>
  </Layout>
);

export default IndexPage;
