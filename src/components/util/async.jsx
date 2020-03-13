import React from 'react';
import styled from 'styled-components';
import Spinner from './spinner';

const Content = styled.div`
    display: contents;
`;

const Async = ({ watch, children }) => {
    return (
        <Content>
            {watch ? children : <Spinner />}
        </Content>
    )
}

export default Async;