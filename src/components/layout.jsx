/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { GeolocationProvider } from './context/geolocation';
import { GmapProvider } from './context/gmap';
import theme from './theme';
import './layout.css';

const Layout = ({ children }) => {

  return (
    <>
      <ThemeProvider theme={theme}>
        <GeolocationProvider>
            <GmapProvider>
                <main>{children}</main>
            </GmapProvider>
        </GeolocationProvider>
      </ThemeProvider>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
