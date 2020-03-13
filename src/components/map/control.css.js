import { css } from 'styled-components';

export default css`
    margin: 1rem 0 0 1rem;
    border-radius: .4rem;
    box-shadow: ${props => props.theme.shadow.xs};
    font-size: ${props => props.theme.map.fontSize};
`;