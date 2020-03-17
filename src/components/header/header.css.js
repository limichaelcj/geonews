import styled from 'styled-components';

export const HeaderRoot = styled.header`
    width: 100%;
    height: ${props => props.theme.header.height};
    padding: 1rem 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    box-shadow: ${props => props.theme.shadow.xs};

    h1,h2,h3,h4,h5,h6 {
        margin: 0;
    }

    p {
        padding: .1rem 0;
        background-color: transparent;
        margin: 0 !important;
        font-size: 0.8em;
    }

    ${props => props.theme.media.tablet} {
        a.button {
            padding: 0 0.5rem;
        }
    }
`;

const HeaderMenu = styled.ul`
    display: flex;
    flex-direction: row;
    align-items: center;
    list-style: none;
    margin: 0;
    & > *:not(:first-child) {
        margin-left: 1rem;
    }
    li {
        margin: 0;
    }
`;

export const HeaderLeft = styled(HeaderMenu)`
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
`

export const HeaderRight = styled(HeaderMenu)`
    justify-content: flex-end;

    ${props => props.theme.media.mobile} {
        position: absolute;
        top: 0;
        right: 0;
        transform: scale(0.9);
    }

`

export default {
    root: HeaderRoot,
    left: HeaderLeft,
    right: HeaderRight,
}