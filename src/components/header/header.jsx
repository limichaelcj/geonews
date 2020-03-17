import React from 'react';
import HeaderCSS from './header.css';
import Form from './form.css';

const Header = ({ setSearchTopic }) => {

    const searchTopicRef = React.useRef(); 

    const handleSearchTopicSubmit = (e) => {
        e.preventDefault();

        if (searchTopicRef.current) {
          setSearchTopic(searchTopicRef.current.value);
        }
    }

    return (
      <HeaderCSS.root>
        <HeaderCSS.left>
          <h3>GeoNews</h3>
          <Form onSubmit={handleSearchTopicSubmit}>
            <input ref={searchTopicRef} placeholder="Search topic" />
          </Form>
        </HeaderCSS.left>
        <HeaderCSS.right>
          <li>
            <a className="button button-clear" href="https://mcli.dev/" target="_blank" rel="noreferrer noopener">
              Made by mcli
            </a>
          </li>
        </HeaderCSS.right>
      </HeaderCSS.root>
    )
}

export default Header;