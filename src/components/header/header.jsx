import React from 'react';
import HeaderCSS from './header.css';

const Header = (props) => {
    return (
      <HeaderCSS.root>
        <HeaderCSS.left>
          <h3>COVID-19 Tracker</h3>
          <code>
              Track relevant coronavirus news in your locale or travel
              destination.
          </code>
        </HeaderCSS.left>
        <HeaderCSS.right>
          <li>
            <a className="button button-clear" href="https://milligram.io/">
              Milligram
            </a>
          </li>
          <li>
            <a
              className="button button-clear"
              href="https://www.npmjs.com/package/eventregistry"
            >
              Event Registry API
            </a>
          </li>
          <li>
            <a
              className="button button-clear"
              href="https://github.com/googlemaps/google-maps-services-js"
            >
              Google Maps API
            </a>
          </li>
        </HeaderCSS.right>
      </HeaderCSS.root>
    )
}

export default Header;