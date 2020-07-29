import React from 'react';
import PropTypes from 'prop-types';
import Panel from './panel.css';
import Spinner from '../util/spinner';

const apiKey = process.env.GATSBY_NEWS_API_KEY;
const apiRoot = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI"

const ArticlePanel = ({locales, setLocaleWeight, localeSelected, searchTopic}) => {

    const panelRef = React.useRef();
    
    const [state, setState] = React.useState({
        loading: true,
        fetchMore: true,
        allArticlesFetched: false,
        error: null,
        articles: [],
        page: 1,
    });

    /*
     *  State handlers
     */

    const handleMoreArticles = (e) => {
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            page: prevState.page + 1,
            fetchMore: true,
        }));
    }

    /*
     *  Functions
     */

    // helper to handle news api fetch response
    const fetchNewsApi = (endpoint) => {
        fetch(endpoint, {
            method: 'GET',
            headers: {
                "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
                "x-rapidapi-key": "***KEY REMOVED***"n                "useQueryString": true
            }
        }).then(res => {
            return res.json();
        }).then(json => {

            const articles = json.value || [];

            const noResults = articles.length < 1;

            if (!noResults) {
                articles.forEach(a => {
                    a.locale = locales[0];
                });
            }

            const appendToList = state.page > 1;

            setState(prevState => ({
                ...prevState,
                loading: false,
                fetchMore: false,
                error: null,
                articles: appendToList ? prevState.articles.concat(articles) : articles,
                allArticlesFetched: noResults,
            }));
        }).catch(error => {
            setState(prevState => ({
                ...prevState,
                loading: false,
                fetchMore: false,
                error,
            }))
        })
    }
    
    // Get articles from News API.
    // Default query without specified locales will
    // return top headlines without location filtering.
    const fetchArticles = function(useQuery = false, page) {
        // get date params        
        const fromDate = new Date();
        fromDate.setDate(new Date().getDate() - 14);

        const queryParams = {
            fromPublishedDate: fromDate.toISOString(),
            toPublishedDate: new Date().toISOString(),
            autoCorrect: false,
            pageNumber: page || state.page,
            pageSize: 10,
            q: useQuery ? [searchTopic, locales[0]].join(' ') : 'headlines',
        }

        // build api endpoint
        const endpoint = encodeURI(apiRoot + '?' + buildQueryString(queryParams));
        // fetch api
        fetchNewsApi(endpoint);
    }

    const getNewArticles = (page) => {
        const useQuery = locales.length > 0 || searchTopic;
        fetchArticles(useQuery, page);

        setState(s => ({
            ...s,
            loading: true,
        }));
    }

    /*
     *  Effects
     */

    // fetch articles on init and locales/searchTopic update
    React.useEffect(() => {
        // new search => provide page number arg
        getNewArticles(1);        
    }, [locales, searchTopic]);

    // fetch more articles effect
    React.useEffect(() => {
        if (state.page > 1) {
            getNewArticles();
        }
    }, [state.page]);

    // update localeWeights after fetchArticles
    React.useEffect(() => {
        // only trigger when finished loading
        if (!state.loading) {
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
    }, [state.loading, state.articles]);

    /*
     *  Render
     */

    return (
      <Panel.list ref={panelRef}>
        <h4>
          {searchTopic ? (
            <strong>
              {searchTopic}
            </strong>
          ) : (
            "News"
          )}
          {locales.length > 0 && (
            <>
              <span> near </span>
              <em>{locales.join(", ")}</em>
            </>
          )}
        </h4>
        {state.loading && !state.fetchMore ? (
            <Panel.item>
                Searching articles... <Spinner />
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
                                <em>{locales[0]}</em>
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
                        {state.loading && !state.newSearch ? (
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