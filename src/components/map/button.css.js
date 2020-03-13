import styled from 'styled-components';
import mapControl from './control.css';

export default styled.button`
    ${mapControl}
    background-color: #fff;
    color: ${props => props.theme.color.primary.main};
    border: none;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
        font-size: 1.2em;
    }
`;