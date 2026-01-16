import express from 'express';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { runLobbyFunction } from './run-lobby-function.js';
import { Matches } from './matches.js';
import { defaultPort } from '../shared/default-port.js';
import { RandomAPI /*, seededDraw*/ } from '../shared/utils/random-api.js';
import { processConnection, processDisconnection } from './process-connection.js';
import { processActionRequest } from './process-action-request.js';

// Used to keep track of live entities
const HEARTBEAT_INTERVAL = 25 * 1000; // 25 seconds - used to keep connections alive
const IDLE_TIMEOUT = 20 * 60 * 1000; // 20 minutes - timeout for idle connections

//const draw = seededDraw(12345);
const draw = () => Math.random();

const random = new RandomAPI(draw);
const matches = new Matches(random);

const app = express();
const PORT = process.env.PORT || defaultPort;

app.use(cors({
  origin: 'http://localhost:5173' // Vite default port
}));

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (http://localhost:${PORT} if running locally).`);

    if (PORT !== defaultPort) {
        console.warn(`(Note that when running on localhost, the port is expected to be ${defaultPort}.)`);
    }
});

const wss = new WebSocketServer({ server });

const isAliveMap = new WeakMap<object, boolean>();
const lastSeenMap = new WeakMap<object, number>();

// Heartbeat runs once every 25s and checks EVERY connected client.
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (isAliveMap.get(ws) === false) {
      return ws.terminate();
    }

    isAliveMap.set(ws, false);
    ws.ping();

    // Check if the connection is idle
    const lastSeen = lastSeenMap.get(ws);
    if (lastSeen !== undefined && Date.now() - lastSeen > IDLE_TIMEOUT) {
      ws.close(1000, 'Idle timeout');
    }
  });
}, HEARTBEAT_INTERVAL);

// Clean up global interval when server closes
wss.on('close', () => clearInterval(interval));

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the dist directory
const distPath = path.resolve(__dirname, '../../dist');

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

app.use(express.static(distPath));

// Fallback - Catch-all for SPA routing'
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

wss.on('connection', (ws, req) => {
  isAliveMap.set(ws, true);
  lastSeenMap.set(ws, Date.now());

  ws.on('pong', () => isAliveMap.set(ws, true));
  
  ws.on('message', (message) => {
    lastSeenMap.set(ws, Date.now()); // Update last activity
    processActionRequest(matches, ws, message.toString());
  });

  ws.on('close', () => {
    processDisconnection(matches, ws);
    // WeakMap entries are garbage collected automatically
  });

  processConnection(matches, ws, req.url);
});
