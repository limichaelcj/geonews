import styled from 'styled-components';

const item = styled.li`
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    border-color: ${props =>
      props.highlight ? props.theme.color.primary.main : "rgba(0, 0, 0, 0.2)"};
    padding: 2rem;
    margin: 0;
    background-color: ${props =>
      props.highlight
        ? "rgba(" + props.theme.color.primary.rgb + ",0.05)"
        : "transparent"};
`

const list = styled.ul`
    margin: 0;
    display: flex;
    flex: 0 0 ${props => props.theme.panel.width};
    max-width: 50vw;
    height: 100%;
    box-shadow: ${props => props.theme.shadow.sm};
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    list-style: none;

    h4 {
        padding: 0 2rem;
    }

    ${props => props.theme.media.tablet} {
        flex: 0 0 60%;
        min-width: 100%;
        max-width: 100%;
    }
`;

export default {
    list,
    item,
}