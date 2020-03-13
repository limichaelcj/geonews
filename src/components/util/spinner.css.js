import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const SpinnerContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Spinner = styled.figure.attrs(props => ({
    color: props.theme.color.text.main,
}))`
    display: inline-block;
    width: 80px;
    height: 80px;
    
    &:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid ${props => props.color};
        border-color: ${props => props.color} transparent ${props => props.color} transparent;
        animation: ${rotate} 1.2s linear infinite;
    }
`;

export default Spinner;