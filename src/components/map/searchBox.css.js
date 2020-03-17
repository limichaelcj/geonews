import styled from 'styled-components';
import { controlBaseCSS } from './control.css';

export default styled.input`
    ${controlBaseCSS}
    border: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: 0;
    padding: 1.05rem 1.5rem;
    outline: none;
`;