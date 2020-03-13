import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { AppContainer } from './index.css';
import ArticlePanel from '../components/article/panel';
import GmapInitializer from '../components/map/initializer';

const IndexPage = () => (
  <Layout>
    <SEO title="COVID-19 Tracker" />
    <AppContainer>
      <ArticlePanel />
      <GmapInitializer />
    </AppContainer>
  </Layout>
)

export default IndexPage;
