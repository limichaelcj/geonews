import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Header from '../components/header/header';
import { AppContainer } from '../styles/index.css';
import ArticlePanel from '../components/article/panel';
import GmapInitializer from '../components/map/initializer';

const IndexPage = () => {

    /*
    *  Page component handles:
    *    - user location
    *    - article locale information
    */

    const [state, setState] = React.useState({
        searchTopic: null,
        locales: [],
        localeWeight: {},
        localeSelected: null,
    });

    /*
    *  State handlers
    */

    // used after fetching articles to define number of articles per focused locale
    const setLocaleWeight = (localeWeight) => {
        setState(s => ({
            ...s,
            localeWeight,
        }));
    }

    // function builder for map markers
    const selectLocale = (localeName) => () => {
        setState(s => ({
            ...s,
            localeSelected: localeName === s.localeSelected ? null : localeName,
        }));
    }

    // set new search topic
    const setSearchTopic = (searchTopic) => {
        setState(s => ({
            ...s,
            searchTopic,
        }));
    }

    /*
    *  Render
    */

    return (
        <Layout>
            <SEO title="GeoNews" />
            <Header
                searchTopic={state.searchTopic}
                setSearchTopic={setSearchTopic}
            />
            <AppContainer>
                <ArticlePanel
                    locales={state.locales}
                    localeSelected={state.localeSelected}
                    setLocaleWeight={setLocaleWeight}
                    searchTopic={state.searchTopic}
                />
                <GmapInitializer
                    setStateIndex={setState}
                    localeWeight={state.localeWeight}
                    selectLocale={selectLocale}
                />
            </AppContainer>
        </Layout>
    )
}

export default IndexPage;
