import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: #EDEDE9;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: scroll;
  }

  * {
    box-sizing: inherit;
  }

  ::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

iframe {
  display: none;
}

`;

export default GlobalStyles;
