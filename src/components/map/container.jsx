import React from 'react';
import Styled from './container.css';

const MapContainer = (props) => {
    return (
        <Styled>
            {props.children}
        </Styled>
    );
}

export default MapContainer;