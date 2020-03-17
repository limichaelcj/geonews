import styled from 'styled-components';

export default styled.form`
    margin: 0;
    padding: 0;
    font-size: 1.5rem;

    input {
        margin: 0 0 0 2rem;
        padding: .2rem .5rem;
        border-radius: 2px;
        border: 1px solid silver;
        background-color: rgba(0,0,0,0.02);

        &:focus {
            background-color: transparent;
        }
    }
`;