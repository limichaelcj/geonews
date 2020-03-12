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
        <h1>COVID-19 Tracker</h1>
        <p>
          Track relevant coronavirus news in your locale or travel destination.
        </p>
        <div>
          <h4>This app uses:</h4>
          <ul>
            <li>
              <a class="button" href="https://milligram.io/">
                Milligram
              </a>
            </li>
            <li>
              <a
                class="button"
                href="https://www.npmjs.com/package/eventregistry"
              >
                Event Registry API
              </a>
            </li>
            <li>
              <a
                class="button"
                href="https://github.com/googlemaps/google-maps-services-js"
              >
                Google Maps API
              </a>
            </li>
          </ul>
        </div>
      </MapContainer>
    </AppContainer>
  </Layout>
)

export default IndexPage;
