import React from 'react';
import PropTypes from 'prop-types';
import Styled from './panel.css';

const ArticlePanel = ({articles}) => {
    return (
        <Styled>
            <h4>Articles</h4>
            {articles.length > 0 ? articles.map((a,i) => (
                <li key={i}>
                    {i}
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