import url from 'url';
import WebSocket from "ws";
import { isWsClientRequest, isWsEndMatch, isWsEndTurn, isWsMove, WsClientRequest } from "../shared/ws-client-request.js";
import { WsResponseTrigger } from "../shared/ws-response-trigger.js";
import { WsServerResponse } from "../shared/ws-server-response.js";
import { Match } from "./match.js";
import { Matches } from "./matches.js";

export class Connections {
    matches: Matches;

    constructor(matches: Matches) {
        this.matches = matches;
    }

    connected(ws: WebSocket, requestUrl: string | undefined) {
        
        let match: Match | undefined = undefined;
        let error: string | null = null;
        
        const trigger : WsResponseTrigger = { clientConnection: true };
        
        try {
            if (!requestUrl) {
                throw new Error("Connection URL missing");
            }
            const parsedUrl = url.parse(requestUrl, true);

            const urlParam = (name: string) => {
                const param = parsedUrl.query[name];

                if (typeof param !== 'string') {
                    throw new Error(`URL parameter "${name}" missing or invalid`);
                }
                return param;
            }

            const matchID = urlParam("matchID");
            const playerID = urlParam("playerID");
            const credentials = urlParam("credentials");

            match = this.matches.findMatch(matchID);
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
            // in one device, then continues it on another devices with closing the first 
            // connection. (The easy options are either this or dsallowing the new connection,
            // which seems less user-friendly.)
            if (player.isConnected) {
                player.getWs()!.close();
                player.recordDisconnection();
            }

            player.recordConnection(ws);

            broadcastMatchData( match, trigger );
        }
        catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
            console.log('Error during connection:', error);

            const response: WsServerResponse = { trigger, connectionError: error };
            ws.send(JSON.stringify(response));
        }
    }

    disconnected(ws: WebSocket) {
        let match: Match | null = null;
        let error: string | null = null;
        
        const trigger : WsResponseTrigger = { clientConnection: true };
        
        try {
            match = this.matches.getMatchByWebSocket(ws);
            if (!match) {
                throw new Error('Attempt to disconnect player who is not in a match');
            }

            const player = match.findPlayer({ws});
            if (!player) {
                throw new Error("Disconnect report when player not connected");
            }

            player.recordDisconnection();

            broadcastMatchData( match, trigger );
        } catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
            console.error('Error during player disconnect:', error);

            // Unable to send error response to disconnected player.
        }
    }

    // Handle a player-requested action (move, end turn, etc)
    actionRequest(ws: WebSocket, str: string) {
        let clientRequest: WsClientRequest | null = null;
        try {
            const match = this.matches.getMatchByWebSocket(ws);
            const player = match?.findPlayer({ws});
            if (!match || !player) {
                throw new Error('Player not in a match');
            }

            const rawRequest = JSON.parse(str);
            if ( isWsClientRequest(rawRequest) ) {
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

            broadcastMatchData(match, clientRequest);
        } catch (err) {
            const error = err instanceof Error ? err.message : "unknown error";
            console.warn(`Error: ${error} when processing client request ${str}`); 

            const response: WsServerResponse = { 
                trigger: clientRequest || { badClientRequest: true }, 
                connectionError: error };
            sendResponse(ws, response);
        }
    }

    error(_ws: WebSocket, error: Error) {
        // What should be done here?
        console.error('WebSocket error:', error);
    }
}

function sendResponse(ws: WebSocket, response: WsServerResponse) {
    ws.send(JSON.stringify(response));
}

function broadcastMatchData(
    match: Match, 
    trigger: WsResponseTrigger,
) { 
    const response: WsServerResponse = 
        { trigger, matchData: match.matchData() };

    for (const player of match.players) {
        if (player.isConnected) {
          const ws = player.getWs();
          if(ws)
            sendResponse(ws, response);
          else
            console.error(`Player ${player.id} is marked as connected but has no WebSocket`);
        }
    }
}