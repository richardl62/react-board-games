import WebSocket from 'ws';
import { WsServerResponse } from '../shared/ws-server-response.js';

export function sendServerResponse(ws: WebSocket, response: WsServerResponse) {
    if (ws.readyState === WebSocket.OPEN) {
        try {
            ws.send(JSON.stringify(response));
        } catch (err) {
            console.error('Error sending WebSocket response:', err);
        }
    } else {
        console.warn('Attempted to send WebSocket response on non-open socket');
    }
}

// Close a connection with a string giving reason. 
// (The closure is delayed slightly to allow any final messages to be sent.) 
export function closeWithReason(ws: WebSocket, reason: string) {
    const code = 4000; // Application-defined close code
    const delayMs = 50;

    const safeReason = reason.slice(0, 120); // WebSocket reason must be <= 123 bytes
    const doClose = () => {
        try {
            ws.close(code, safeReason);
        } catch {
            console.warn('WebSocket close failed, terminating connection');
            try { ws.terminate(); } catch { /* noop */ }
        }
    };

    setTimeout(doClose, delayMs);
}

