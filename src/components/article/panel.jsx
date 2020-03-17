import React from 'react';
import PropTypes from 'prop-types';
import Styled from './panel.css';

const apiKey = process.env.NEWS_API_KEY;

const ArticlePanel = ({locales}) => {
    
    const [state, setState] = React.useState({
        loading: true,
        articles: [],
    });

    /*
     *  Functions
     */
    
    // Get articles from News API.
    // Default query without specified locales will
    // return top headlines without location filtering.
    const fetchArticles = function() {
        // get date params        
        const lastWeek = new Date();
        lastWeek.setDate(new Date().getDate() - 7);
        const dateString = `${lastWeek.getFullYear()}-${('0'+(lastWeek.getMonth()+1)).slice(-2)}-${('0'+lastWeek.getDate()).slice(-2)}`;
        // form keyword/location query
        const keywords = ['coronavirus', ...locales].join(' ').replace(' ', '%20');
        // build api endpoint
        const endpoint = `http://newsapi.org/v2/everything?q="${keywords}"&from=${dateString}&sortBy=publishedAt&apiKey=${apiKey}`;
        console.log(endpoint);
        // fetch api
        fetch(endpoint).then(res => {
            return res.json();
        }).then(res => {
            setState(s => ({
                loading: false,
                articles: res.articles,
            }));
        });
    }

    React.useEffect(() => {
        console.log('fetching articles')
        fetchArticles();
        setState(s => ({
            ...s,
            loading: true,
        }));
    }, []);

    return (
        <Styled>
            <h4>Articles</h4>
            {state.articles.length > 0 ? state.articles.map((a,i) => (
                <li key={i}>
                    {a.title}
                </li>
            )) : (
                <p>No articles</p>
            )}
        </Styled>
    );
}

ArticlePanel.propTypes = {
    articles: PropTypes.array,
}

ArticlePanel.defaultProps = {
    articles: [],
}

export default ArticlePanel;