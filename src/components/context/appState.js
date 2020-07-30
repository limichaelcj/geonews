import React from 'react';

const AppStateContext = React.createContext(null);

// Provider component
export const AppStateProvider = ({ children }) => {

    const [state, setState] = React.useState({
        // header
        searchQuery: null,
        // articles
        loadingArticles: false,
        articles: [],
        page: 1,
        fetchMore: false,
        allArticlesFetched: false,
        articlesError: null,
        // map
        locales: [],
        localeWeight: {},
        localeSelected: null,
        searchBox: null, // fill with places.Autocomplete() instance
        markers: [], // fill with marker data: { coords, weight, localeName }
        updateMarkers: true,
    });

    return (
        <AppStateContext.Provider value={[state, setState]}>
            {children}
        </AppStateContext.Provider>
    );
}

// Hook within component
export const useAppState = () => {
    return React.useContext(AppStateContext);
}