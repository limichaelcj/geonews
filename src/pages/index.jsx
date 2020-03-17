import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { AppContainer } from './index.css';
import ArticlePanel from '../components/article/panel';
import GmapInitializer from '../components/map/initializer';

const IndexPage = () => {

  /*
   *  Page component handles:
   *    - user location
   *    - article locale filtering strings
   */

  const [state, setState] = React.useState({
    userLocation: null,
    locales: [],
  });

  /*
   *  State handlers
   */

  const setUserLocation = (userLocation) => {
    setState(s => ({
      ...s,
      userLocation,
    }));
  }

  const setLocales = (locales) => {
    setState(s => ({
      ...s,
      locales
    }));
  }

  const addLocales = (locales) => {
    setState(s => ({
      ...s,
      locales: [
        ...s.locales,
        ...locales,
      ]
    }));
  }

  const clearLocales = () => {
    setState(s => ({
      ...s,
      locales: [],
    }));
  }

  /*
   *  Functions
   */

  const getUserLocation = function(callback = (p) => console.log(p)) {
    if ("navigator" in window && window.navigator.geolocation) {
      // first callback is given a position argument from .getCurrentPosition()
      navigator.geolocation.getCurrentPosition(
        callback,
        err => alert(err),
      );
    }
  }

  /*
   *  Effects
   */

  React.useEffect(() => {
    getUserLocation(setUserLocation);
  }, []);

  /*
   *  Render
   */

  return (
    <Layout>
      <SEO title="COVID-19 Tracker" />
      <AppContainer>
        <ArticlePanel locales={state.locales} />
        <GmapInitializer
          userLocation={state.userLocation}
          getUserLocation={getUserLocation}
          setStateIndex={setState}
        />
      </AppContainer>
    </Layout>
  );
}

export default IndexPage;
