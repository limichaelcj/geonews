import React from 'react';
import { Link } from 'gatsby';
import Image from '../components/image';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { AppContainer } from './index.css';
import ArticlePanel from '../components/article/panel';
import MapContainer from '../components/map/container';

const IndexPage = () => (
  <Layout>
    <SEO title="COVID-19 Tracker" />
    <AppContainer>
      <ArticlePanel />
      <MapContainer>
        Google Map
      </MapContainer>
    </AppContainer>
  </Layout>
)

export default IndexPage;
