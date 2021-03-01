import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import games from './games';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App games={games} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);