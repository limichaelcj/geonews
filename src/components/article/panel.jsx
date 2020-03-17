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

    const formatContent = (content) => {
        if (!content) return '';
        return content.replace(/(<.*>|\[.*chars\]$)/g, '');
    }
    
    // Get articles from News API.
    // Default query without specified locales will
    // return top headlines without location filtering.
    const fetchArticles = function() {
        // get date params        
        const lastWeek = new Date();
        lastWeek.setDate(new Date().getDate() - 7);
        const dateString = `${lastWeek.getFullYear()}-${('0'+(lastWeek.getMonth()+1)).slice(-2)}-${('0'+lastWeek.getDate()).slice(-2)}`;
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
            setState(s => ({
                loading: false,
                articles: res.articles || [],
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
        <h4>Articles{locales.length > 0 ? ' near ' + locales.join(', ') : ''}</h4>
        {state.articles.length > 0 ? (
          state.articles.map((a, i) => (
            <li key={i}>
              <a href={a.url} target="__blank" rel="noreferrer noopener">
                <h5>
                  <strong>{a.title}</strong>
                </h5>
              </a>
              <h6>
                <em>{a.author}</em>
              </h6>
              <p>{formatContent(a.content || a.description)}</p>
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