import express from 'express';
import path from 'path';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { runLobbyFunction } from './run-lobby-function.js';
import { Connections } from './connections.js';
import { Matches } from './matches.js';

const matches = new Matches();
const connections = new Connections(matches);

const app = express();
const PORT = process.env.PORT || 8000;

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

app.use(function(_req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
    connections.message(ws, message.toString());
  });
});
