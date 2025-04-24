import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the dist directory
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

// API endpoint example
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

// Catch-all to serve index.html for SPA routing
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(distPath, 'index.html'));
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});