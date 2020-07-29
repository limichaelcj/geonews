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
        error: null,
        articles: [],
    });

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

            articles.forEach(a => {
                a.locale = locales[0];
            });

            setState({
                loading: false,
                error: null,
                articles,
            });
        }).catch(error => {
            setState(prevState => ({
                ...prevState,
                loading: false,
                error,
            }))
        })
    }
    
    // Get articles from News API.
    // Default query without specified locales will
    // return top headlines without location filtering.
    const fetchArticles = function(useQuery = false) {
        // get date params        
        const fromDate = new Date();
        fromDate.setDate(new Date().getDate() - 14);

        const queryParams = {
            fromPublishedDate: fromDate.toISOString(),
            toPublishedDate: new Date().toISOString(),
            autoCorrect: false,
            pageNumber: 1,
            pageSize: 10,
            q: useQuery ? [searchTopic, locales[0]].join(' ') : 'headlines',
        }

        // build api endpoint
        const endpoint = encodeURI(apiRoot + '?' + buildQueryString(queryParams));
        // fetch api
        fetchNewsApi(endpoint);
    }

    /*
     *  Effects
     */

    // fetch articles on init and locales or searchTopic update
    React.useEffect(() => {

        const useQuery = locales.length > 0 || searchTopic;
        fetchArticles(useQuery);
        
        setState(s => ({
            ...s,
            loading: true,
        }));
        // scroll panel to top after new search
        panelRef.current.scrollTop = 0;
    }, [locales, searchTopic]);

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
            setLocaleWeight(weights);
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
        {state.loading ? (
            <Panel.item>
                Searching articles... <Spinner />
            </Panel.item>
        ) : state.articles.length > 0 ? (
            state.articles
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