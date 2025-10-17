import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { allGames } from '../game-control/games/all-games.js';

const app = express();
const PORT = 3000;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the dist directory
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

// API endpoint example
app.get('/api/hello', (_req, res) => {
    const gameNames = allGames.map(g => g.name);
    const message = `Available games: ${gameNames.join()}`;
    console.log('API called:', message);
    res.json({ message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});