import styled from 'styled-components';

export default styled.input`
    margin: 1rem;
    padding: 1rem 1.5rem;
    font-size: 14px;
    border-radius: 10px;
    border: none;
    box-shadow: ${props => props.theme.shadow.xs};
    outline: none;
`;