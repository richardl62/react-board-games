import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import games from './games';
import App from './app';
import { getOptionsFromLocation } from './url-tools';
const options = getOptionsFromLocation(window.location);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App games={games} options={options} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);