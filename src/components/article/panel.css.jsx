import styled from 'styled-components';

export default styled.ul`
    margin: 0;
    display: flex;
    flex: 0 0 240px;
    min-width: 240px;
    max-width: 240px;
    height: 100%;
    box-shadow: ${props => props.theme.shadow.sm};
    padding: 2rem;
    display: flex;
    flex-direction: column;
`