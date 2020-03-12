import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { AppContainer } from './index.css';
import ArticlePanel from '../components/article/panel';
import GoogleMap from '../components/map/gmap';

const IndexPage = () => (
  <Layout>
    <SEO title="COVID-19 Tracker" />
    <AppContainer>
      <ArticlePanel />
      <GoogleMap />
    </AppContainer>
  </Layout>
)

export default IndexPage;
