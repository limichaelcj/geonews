import styled from 'styled-components';

export const AppContainer = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    height: calc(100vh - ${props => props.theme.header.height});
    width: 100%;

    ${props => props.theme.media.tablet} {
        flex-direction: column-reverse;
    }
`;