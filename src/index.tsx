import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import games from './games';
import App from './app';
import AppOptions from './app/app-options';
const options = new AppOptions(window.location);

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