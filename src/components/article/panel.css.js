import styled from 'styled-components';

export default styled.ul`
    margin: 0;
    display: flex;
    flex: 0 0 ${props => props.theme.panel.width};
    max-width: 50vw;
    height: 100%;
    box-shadow: ${props => props.theme.shadow.sm};
    padding: 2rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    list-style: none;

    li {
        border-top: 1px solid rgba(0,0,0,0.2);
        padding: 2rem 0;
    }

    ${props => props.theme.media.tablet} {
        flex: 0 0 60%;
        min-width: 100%;
        max-width: 100%;
    }
`