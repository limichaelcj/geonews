import styled from 'styled-components';

export default styled.ul`
    margin: 0;
    display: flex;
    flex: 0 0 240px;
    min-width: ${props => props.theme.panel.width};
    max-width: ${props => props.theme.panel.width};
    height: 100%;
    box-shadow: ${props => props.theme.shadow.sm};
    padding: 2rem;
    display: flex;
    flex-direction: column;
`