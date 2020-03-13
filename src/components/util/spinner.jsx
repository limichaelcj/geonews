import React from 'react';
import SpinnerCSS, { SpinnerContainer } from './spinner.css';

const Spinner = (props) => {
    return (
        <SpinnerContainer>
            <SpinnerCSS />
        </SpinnerContainer>   
    );
}

export default Spinner;