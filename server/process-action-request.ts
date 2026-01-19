import WebSocket from 'ws';
import { isWsClientRequest, isWsEndTurn, isWsEndMatch, isWsMove } from '../shared/ws-client-request.js';
import { Matches } from './matches.js';
import { closeWithReason } from './web-socket-actions.js';

// Throw if there is a 'serious' error, otherwise process the action.
// Serious errors are those that prevent an action being attempted, for example
// being unable to interpret the request. Other errors (for example invalid moves)
// are caught are reported back to the client.
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
            match.events.endTurn();
        } else if (isWsEndMatch(clientRequest.action)) {
            match.events.endMatch();
        } else if (isWsMove(clientRequest.action)) {
            match.move(clientRequest.action, player.id);
        } else {
            // In practice this should happen only if there is a missing case
            // in the if/else tests above.
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
        closeWithReason(ws, 'WebSocket received invalid data');
    }
}
