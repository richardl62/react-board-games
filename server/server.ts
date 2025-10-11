import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { helloMessage } from './utils/hello-message.js';

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
    const message = helloMessage();
    console.log('API called:', message);
    res.json({ message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});