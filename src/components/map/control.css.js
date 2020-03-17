import styled, { css } from 'styled-components';

export const controlBaseCSS = css`
    margin: 1rem 0;
    box-shadow: ${props => props.theme.shadow.xs};
    font-size: ${props => props.theme.map.fontSize};
`;

export default styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 1rem;
`;