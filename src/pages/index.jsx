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
    localeWeight: {},
    localeSelected: null,
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

  const setLocaleWeight = (localeWeight) => {
    setState(s => ({
      ...s,
      localeWeight,
    }));
  }

  const selectLocale = (localeName) => () => {
    setState(s => ({
      ...s,
      localeSelected: localeName === s.localeSelected ? null : localeName,
    }));
  }

  /*
   *  Functions
   */

  const getUserLocation = function(callback = () => null) {
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

  // get user location on page load
  React.useEffect(() => {
    getUserLocation(setUserLocation);
  }, []);

  React.useEffect(() => {
    console.log(state);
  })

  /*
   *  Render
   */

  return (
    <Layout>
      <SEO title="COVID-19 Tracker" />
      <AppContainer>
        <ArticlePanel
          locales={state.locales}
          localeSelected={state.localeSelected}
          setLocaleWeight={setLocaleWeight}
        />
        <GmapInitializer
          userLocation={state.userLocation}
          getUserLocation={getUserLocation}
          setStateIndex={setState}
          localeWeight={state.localeWeight}
          selectLocale={selectLocale}
        />
      </AppContainer>
    </Layout>
  );
}

export default IndexPage;
