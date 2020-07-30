import React from 'react';
import PropTypes from 'prop-types';
import Panel from './panel.css';
import Spinner from '../util/spinner';
import { useAppState } from '../context/appState';

const apiKey = process.env.GATSBY_NEWS_API_KEY;
const apiRoot = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI"
const requestOptions = {
    method: 'GET',
    headers: {
        "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        "x-rapidapi-key": "***KEY REMOVED***"n        "useQueryString": true
    }
}
const timeoutDuration = 15000; //ms

const ArticlePanel = () => {

    const panelRef = React.useRef();

    const [state, setState] = useAppState();

    /*
     *  State handlers
     */

    const setLocaleWeight = (localeWeight, updateMarkers) => {
        setState(prevState => ({
            ...prevState,
            localeWeight,
            updateMarkers,
        }));
    }

    /*
     *  Functions
     */

    // Fetch articles from news API
    const fetchArticles = (useQuery = false, page) => {
        console.log('fetcharticles: ', state);
        // get date params
        const fromDate = new Date();
        fromDate.setDate(new Date().getDate() - 14);

        // prepare query params
        const queryParams = {
            fromPublishedDate: fromDate.toISOString(),
            toPublishedDate: new Date().toISOString(),
            autoCorrect: false,
            pageNumber: page || state.page + 1,
            pageSize: 10,
            q: useQuery ? [state.searchQuery, state.locales[0]].join(' ') : 'headlines',
        }

        // prepare endpoint from query params
        const endpoint = encodeURI(apiRoot + '?' + buildQueryString(queryParams));

        // initiate async fetch
        return new Promise((resolve, reject) => {
            // create req. timeout error
            setTimeout(() => {
                reject('The request timed out.');
            }, timeoutDuration);

            fetch(endpoint, requestOptions).then(res => {
                return res.json();
            }).then(json => {

                const articles = json.value || [];
                const noResults = articles.length < 1;

                if (!noResults) {
                    articles.forEach(a => {
                        a.locale = state.locales[0];
                    });
                }

                const appendToList = queryParams.pageNumber > 1;

                setState(prevState => ({
                    ...prevState,
                    loadingArticles: false,
                    articlesError: null,
                    page: queryParams.pageNumber,
                    fetchMore: false,
                    articles: appendToList ? prevState.articles.concat(articles) : articles,
                    allArticlesFetched: noResults,
                }));

                resolve();
            });
        });
    }

     // get articles with page spec and set loading state
    const getArticles = (page) => {
        
        // abort fetch if already fetching
        if (state.loadingArticles) {
            return;
        }

        const useQuery = state.locales.length > 0 || state.searchQuery;
        // async
        fetchArticles(useQuery, page).catch(articlesError => {
            setState(prevState =>({
                ...prevState,
                loadingArticles: false,
                articlesError,
            }))
        });

        setState(s => ({
            ...s,
            loadingArticles: true,
            fetchMore: page !== 1,
        }));
    }

    /*
     *  State handlers
     */

    const handleNewArticles = (e) => {
        getArticles(1);
    }

    const handleMoreArticles = (e) => {
        getArticles();
    }

    /*
     *  Effects
     */

    // fetch articles on init and locales/searchQuer update
    React.useEffect(() => {
        // new search => provide page number arg
        handleNewArticles();
    }, [state.locales, state.searchQuery]);

    // update localeWeights after fetchArticles
    React.useEffect(() => {
        // only trigger when finished loading
        if (!state.loadingArticles) {
            const weights = {};

            state.articles.forEach(art => {
                // increment locale tally
                if (art.locale) {
                  if (weights.hasOwnProperty(art.locale)) {
                    weights[art.locale]++;
                  } else {
                    weights[art.locale] = 1;
                  }
                }
            });

            // update index localeWeights
            setLocaleWeight(weights, state.page <= 1);
        }
    }, [state.loadingArticles, state.articles]);

    /*
     *  Render
     */

    return (
      <Panel.list ref={panelRef}>
        <h4>
            {state.searchQuery ? (
                <strong>{state.searchQuery}</strong>
            ) : "News"}
            {state.locales.length > 0 && (
                <>
                <span> near </span>
                <em>{state.locales.join(", ")}</em>
                </>
            )}
        </h4>
        {state.loadingArticles && !state.fetchMore ? (
            <Panel.item>
                Fetching articles... <Spinner />
            </Panel.item>
        ) : state.articles.length > 0 ? (
            <>
                {state.articles
                    .map((a, i) => (
                        <Panel.item key={i}>
                            <a href={a.url} target="__blank" rel="noreferrer noopener">
                            <h5>
                                <strong dangerouslySetInnerHTML={createMarkup(a.title)} />
                            </h5>
                            </a>
                            {/* <h6>
                                <em>{state.locales[0]}</em>
                                <span> &ndash; </span>
                                <em>{}</em>
                            </h6> */}
                            <p dangerouslySetInnerHTML={createMarkup((a.description || a.body).slice(0, 300))} />
                            <em>{new Date(a.datePublished).toDateString()}</em>
                        </Panel.item>
                    ))
                }
                {!state.allArticlesFetched && (
                    <Panel.item>
                        {state.loadingArticles && state.fetchMore ? (
                            <Spinner />
                        ) : (
                            <button onClick={handleMoreArticles}>
                                Load More
                            </button>
                        )}
                    </Panel.item>
                )}
            </>
        ) : (
            <Panel.item>
                No articles found.
                <button onClick={handleNewArticles}>
                    Try again
                </button>
            </Panel.item>
        )}
      </Panel.list>
    )
}

// helper to build query string from query params object
function buildQueryString(obj) {
    return Object.entries(obj).map(([key, value]) => {
        return key + '=' + value;
    }).join('&');
}

function createMarkup(value) {
    return { __html: value };
}

ArticlePanel.propTypes = {
    articles: PropTypes.array,
}

ArticlePanel.defaultProps = {
    articles: [],
}

export default ArticlePanel;
