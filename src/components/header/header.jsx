import React from 'react';
import HeaderCSS from './header.css';

const Header = (props) => {
    return (
      <HeaderCSS.root>
        <HeaderCSS.left>
          <h4>COVID-19 Tracker</h4>
          <p>
            Get localized coronavirus news
          </p>
        </HeaderCSS.left>
        <HeaderCSS.right>
          <li>
            <a className="button button-clear" href="https://mcli.dev/">
              Made by mcli
            </a>
          </li>
        </HeaderCSS.right>
      </HeaderCSS.root>
    )
}

export default Header;