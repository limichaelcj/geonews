import styled, { css } from 'styled-components';
import { controlBaseCSS } from './control.css';

export default styled.button`
  ${controlBaseCSS}
  background-color: #fff;
  color: ${props => props.theme.color.primary.main};
  border: none;
  border-radius: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 1.2em;
  }
`