import styled from 'styled-components';
import mapControl from './control.css';

export default styled.button`
    ${mapControl}
    background-color: #fff;
    color: ${props => props.theme.color.primary.main};
    border: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
        font-size: 1.2em;
    }
`;