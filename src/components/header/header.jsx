import React from 'react';
import HeaderCSS from './header.css';
import Form from './form.css';
import { useAppState } from '../context/appState';

const Header = () => {

    const searchQueryRef = React.useRef(); 

    const [state, setState] = useAppState();

    /*
     *  State handlers
     */

    const searchQuery = (searchQuery) => {
        setState(prevState => ({
            ...prevState,
            searchQuery,
        }));
    }

    const searchQuerySubmit = (e) => {
        e.preventDefault();

        if (searchQueryRef.current) {
            searchQuery(searchQueryRef.current.value);
        }
    }

    return (
      <HeaderCSS.root>
        <HeaderCSS.left>
            <h3>GeoNews</h3>
            <Form onSubmit={searchQuerySubmit}>
                <input ref={searchQueryRef} placeholder="Enter search query" disabled={state.loadingArticles} />
            </Form>
            {state.loadingArticles && <span>&bull;&bull;&bull;</span>}
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