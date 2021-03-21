import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import App from './app/App';
require('dotenv').config();

const colors = {
  main: {
    1: '#171717',
    2: '#222222',
    3: '#333333',
    green: '#0d8209',
    white: '#ffffff',
    red: '#e61d12',
  },
};

ReactDOM.render(
  <ChakraProvider theme={extendTheme({ colors })}>
    <React.StrictMode>
      <CSSReset />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
