import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Header from '../components/header/header';
import { AppContainer } from '../components/app.css';
import ArticlePanel from '../components/article/panel';
import GmapInitializer from '../components/map/initializer';
import { AppStateProvider } from '../components/context/appState';

const IndexPage = () => {

    return (
        <AppStateProvider>
            <Layout>
                <SEO title="GeoNews" />
                <Header />
                <AppContainer>
                    <ArticlePanel />
                    <GmapInitializer />
                </AppContainer>
            </Layout>
        </AppStateProvider>
    )
}

export default IndexPage;
