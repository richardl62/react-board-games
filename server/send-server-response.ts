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
