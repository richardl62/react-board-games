import express from 'express';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { runLobbyFunction } from './run-lobby-function.js';
import { Connections } from './connections.js';
import { Matches } from './matches.js';
import { serverPort } from '../shared/server-address.js';
import { RandomAPI /*, seededDraw*/ } from '../shared/game-control/random-api.js';

//const draw = seededDraw(12345);
const draw = () => Math.random()

const random = new RandomAPI(draw);
const matches = new Matches(random);
const connections = new Connections(matches);

const app = express();
const PORT = process.env.PORT || serverPort;

app.use(cors({
  origin: 'http://localhost:5173' // Vite default port
}));

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the dist directory
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));


// Run all the functions provided by the LobbyClient
// The name of the function to run (createMatch, joinMatch etc)
// is provided as a query parameter.
app.get('/lobby', (req, res) => {
  try {
    const result = runLobbyFunction(matches, req.query);
    res.send(JSON.stringify(result));
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("Error in /lobby:", message);
    res.status(400).send(`Lobby error: ${message}`);
  }
});

wss.on('connection', (ws, req)  => {

  connections.connection(ws, req.url);

  ws.on('close', () => {
    connections.close(ws);
  })

  ws.on('error', (error) => {
    connections.error(ws, error);
  });

  ws.on('message', message => { 
    connections.matchRequest(ws, message.toString());
  });
});
