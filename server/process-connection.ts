import WebSocket from "ws";
import { wsClientConnection } from "../shared/ws-response-trigger.js";
import { Matches } from "./matches.js";
import { sendServerResponse } from './send-server-response.js';

// Return the value of the named URL parameter from the given request URL.
// Throw an error if the parameter is missing or invalid.
function urlParam(requestUrl: string | undefined, name: string) {
    if (!requestUrl) throw new Error("Unexpected null request URL");
    
    const parsed = new URL(requestUrl, "http://localhost" /* dummy base URL */);
    const param = parsed.searchParams.get(name);

    if (!param) {
        throw new Error(`URL parameter "${name}" missing or invalid`);
    }
    return param;
}

// Close a connection with a string giving reason. 
// (The closure is delayed slightly to allow any final messages to be sent.) 
function closeWithReason(ws: WebSocket, reason: string) {
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

export function processConnection(matches: Matches, ws: WebSocket, requestUrl: string | undefined) {
    try {
        const matchID = urlParam(requestUrl, "matchID");
        const playerID = urlParam(requestUrl, "playerID");
        const credentials = urlParam(requestUrl, "credentials");

        const match = matches.findMatch(matchID);
        if (!match) {
            throw new Error(`Match ${matchID} not found - cannot connect player`);
        }

        const player = match.findPlayer({ id: playerID });
        if (!player) {
            throw new Error(`Player ${playerID} not found - cannot record connection`);
        }

        if (player.credentials !== credentials) {
            throw new Error(`Player ${playerID} provided invalid credentials`);
        }

        // KLUDGE? If the player is already connected, terminate the previous connection.
        // This is primarily intended for the case where a player starts a match
        // on one device, then continues it on another device without closing the first
        // connection. (The easy options are either this or disallowing the new connection,
        // and this option seems more user-friendly.)
        if (player.isConnected) {
            player.recordDisconnection();
            closeWithReason(player.getWs(), "duplicate connection");
        }

        player.recordConnection(ws);

        match.broadcastMatchData(wsClientConnection);
    }
    catch (err) {
        const error = err instanceof Error ? err.message : "unknown error";
        console.log('Error during connection:', error);

        sendServerResponse(ws, { trigger: wsClientConnection, connectionError: error });
        closeWithReason(ws, error);
    }
}

export function processDisconnection(matches: Matches, ws: WebSocket) {
    try {
        const found = matches.findMatchAndPlayer(ws);
        if (!found) {
            console.log('Disconnect reported from socket with no associated player/match');
            return;
        }

        const { match, player } = found;

        player.recordDisconnection();

        match.broadcastMatchData(wsClientConnection);
    } catch (err) {
        // Hmm. Not sure what best to do as we cannot send error response to disconnected player.
        const error = err instanceof Error ? err.message : "unknown error";
        console.error('Error during player disconnect:', error);
    }
}