import React from 'react';
import PropTypes from 'prop-types';
import Panel from './panel.css';

const apiKey = process.env.NEWS_API_KEY;

const ArticlePanel = ({locales}) => {

    const panelRef = React.useRef();
    
    const [state, setState] = React.useState({
        loading: true,
        articles: [],
    });

    /*
     *  Functions
     */

    // remove metadata in article.content string
    const formatContent = (content) => {
        if (!content) return '';
        return content.replace(/(<.*>|\[.*chars\]$)/g, '');
    }

    const getTopicLocale = function(article) {
        if (!locales || locales.length < 1) return;

        locales.forEach(lname => {
            if (article.title.includes(lname) || article.content.includes(lname)) {
                return article.locale = lname;
            }
        })
    }
    
    // Get articles from News API.
    // Default query without specified locales will
    // return top headlines without location filtering.
    const fetchArticles = function() {
        // get date params        
        const fromDate = new Date();
        fromDate.setDate(new Date().getDate() - 14);
        const dateString = `${fromDate.getFullYear()}-${('0'+(fromDate.getMonth()+1)).slice(-2)}-${('0'+fromDate.getDate()).slice(-2)}`;
        // form keyword/location query
        const topicQuery = `(coronavirus OR covid-19)`;
        const localeQuery = locales.length > 0 ? ` AND (${locales.join(' OR ')})` : '';
        const keywords = encodeURI(`${topicQuery}${localeQuery}`);
        // build api endpoint
        const endpoint = `http://newsapi.org/v2/everything?q=${keywords}&from=${dateString}&sortBy=popularity&apiKey=${apiKey}&language=en`;
        // fetch api
        console.log(locales)
        fetch(endpoint).then(res => {
            return res.json();
        }).then(res => {

            const articles = res.articles || [];
        
            articles.forEach(art => {
                getTopicLocale(art);
            })

            setState(s => ({
                loading: false,
                articles,
            }));
        });
    }

    /*
     *  Effects
     */

    // fetch articles on init and locales update
    React.useEffect(() => {
        fetchArticles();
        setState(s => ({
            ...s,
            loading: true,
        }));
        // scroll panel to top after new search
        panelRef.current.scrollTop = 0;
    }, [locales]);

    /*
     *  Render
     */

    return (
      <Panel ref={panelRef}>
        <h4>News{locales.length > 0 ? " near " + locales.join(", ") : ""}</h4>
        {state.articles.length > 0 ? (
          state.articles.filter(a => !!a.locale).map((a, i) => (
            <li key={i}>
              <a href={a.url} target="__blank" rel="noreferrer noopener">
                <h5>
                  <strong>{a.title}</strong>
                </h5>
              </a>
              <h6>
                <em>{a.author}</em>
                {a.locale && (
                    <>
                        <span> &ndash; </span>
                        <em>{a.locale}</em>
                    </>
                )}
              </h6>
              <p>{formatContent(a.content || a.description)}</p>
              <em>{new Date(a.publishedAt).toDateString()}</em>
            </li>
          ))
        ) : (
          <p>No articles</p>
        )}
      </Panel>
    )
}

ArticlePanel.propTypes = {
    articles: PropTypes.array,
}

ArticlePanel.defaultProps = {
    articles: [],
}

export default ArticlePanel;