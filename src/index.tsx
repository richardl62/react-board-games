import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import games from './games';
import App from './app';
import { getOptions } from './url-tools';
const options = getOptions(new URLSearchParams(window.location.search));

const servers = { // KLUDGE
  game: 'http://localhost:3000',
  lobby: 'http://localhost:8000',
}
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App servers={servers} games={games} options={options} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);