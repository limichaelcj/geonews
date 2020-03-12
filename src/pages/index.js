import React from 'react';
import { Link } from 'gatsby';
import Image from '../components/image';
import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="COVID-19 Tracker" />
    <div style={{width: 100, margin: '2rem 0'}}>
      <Image filename="gatsby-icon.png" />
    </div>
    <h1>COVID-19 Tracker</h1>
    <p>Track relevant coronavirus news in your locale or travel destination.</p>
    <div>
      <h4>This app uses:</h4>
      <ul>
        <li>
          <a class="button" href="https://milligram.io/">Milligram</a>
        </li>
        <li>
          <a class="button" href="https://www.npmjs.com/package/eventregistry">Event Registry API</a>
        </li>
        <li>
          <a class="button" href="https://github.com/googlemaps/google-maps-services-js">Google Maps API</a>
        </li>
      </ul>
    </div>
  </Layout>
);

export default IndexPage;
