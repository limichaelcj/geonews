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

    code {
        padding: 1rem;
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
`;

export const HeaderRight = styled(HeaderMenu)`
    justify-content: flex-end;
`

export default {
    root: HeaderRoot,
    left: HeaderLeft,
    right: HeaderRight,
}