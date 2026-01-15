import WebSocket from 'ws';
import { WsClientRequest, isWsClientRequest, isWsEndTurn, isWsEndMatch, isWsMove } from '../shared/ws-client-request.js';
import { WsServerResponse } from '../shared/ws-server-response.js';
import { Matches } from './matches.js';
import { sendServerResponse } from './send-server-response.js';
import { wsBadClientRequest } from '../shared/ws-response-trigger.js';

// Handle a player-requested action (move, end turn, etc)
export function processActionRequest(matches: Matches, ws: WebSocket, str: string) {
    let clientRequest: WsClientRequest | null = null;
    try {
        const found = matches.findMatchAndPlayer(ws);
        if (!found) {
            throw new Error('Player not in a match');
        }

        const { match, player } = found;
        const rawRequest = JSON.parse(str);
        if (isWsClientRequest(rawRequest)) {
            clientRequest = rawRequest;
        } else {
            throw new Error('Invalid client request');
        }

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

        match.broadcastMatchData(clientRequest);
    } catch (err) {
        const error = err instanceof Error ? err.message : "unknown error";
        console.warn(`Error: ${error} when processing client request ${str}`);

        const response: WsServerResponse = {
            trigger: clientRequest || wsBadClientRequest,
            connectionError: error
        };
        sendServerResponse(ws, response);
    }
}
