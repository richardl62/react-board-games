import WebSocket from 'ws';
import { isWsClientRequest, isWsEndTurn, isWsEndMatch, isWsMove } from '../shared/ws-client-request.js';
import { Matches } from './matches.js';
import { closeWithReason } from './web-socket-actions.js';

// Throw if there is an error that prevent the requested action being attempted, for example
// if the web socket is not associated with a player. Other errors (for example invalid moves)
// are caught and reported back to the client via broadcastMatchData.
export function doProcessActionRequest(matches: Matches, ws: WebSocket, request: string) {
const found = matches.findMatchAndPlayer(ws);
    if (!found) {
        throw new Error('WebSocket not associated with a player');
    }
    const { match, player } = found;

    const clientRequest = JSON.parse(request);
    if (!isWsClientRequest(clientRequest)) {
        throw new Error('WebSocket received invalid data');
    } 

    let error: string | null = null;
    try {
        if (isWsEndTurn(clientRequest.action)) {
            match.endTurn();
        } else if (isWsEndMatch(clientRequest.action)) {
            match.endMatch();
        } else if (isWsMove(clientRequest.action)) {
            match.move(clientRequest.action, player.id);
        } else {
            // Should never happen.
            throw new Error("Unrecognised client request");
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "unknown error";
        console.warn(`Error: ${error} when processing client request ${request}`);
    }

    match.broadcastMatchData(clientRequest, error);
}

// Handle a player-requested action (move, end turn, etc)
export function processActionRequest(matches: Matches, ws: WebSocket, request: string) {
    try {
        doProcessActionRequest(matches, ws, request);
    } catch (err) {
        const error = err instanceof Error ? err.message : "unknown error";
        console.warn(`Error: ${error} when processing client request ${request}`);
        closeWithReason(ws, 'bad data received');
    }
}
