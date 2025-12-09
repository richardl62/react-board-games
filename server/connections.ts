import url from 'url';
import WebSocket from "ws";
import { isWsClientRequest, isWsEndMatch, isWsEndTurn, isWsMoveRequest, WsClientRequest } from "../shared/ws-client-request.js";
import { WsResponseTrigger, WsServerResponse } from "../shared/ws-server-response.js";
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
                throw new Error(`Match ${matchID} not found - cannot record connection`);
            }

            const player = match.findPlayer({ id: playerID });
            if (!player) {
                throw new Error(`Player ${playerID} not found - cannot record connection`);
            }

            if (player.isConnected) {
                throw new Error(`Player ${playerID} connected - cannot reconnect`);
            }

            if (player.credentials !== credentials) {
                throw new Error(`Player ${playerID} provided invalid credentials`);
            }

            player.connect(ws);
        }
        catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
            console.log('Error during connection:', error);
        }

        const trigger : WsResponseTrigger = { clientConnection: true };
        if (match) {
            broadcastMatchData( match, trigger, error );
        } else {
            const response: WsServerResponse = { trigger, matchData: null, error };
            ws.send(JSON.stringify(response));
        }
    }

    disconnected(ws: WebSocket) {
        let match: Match | null = null;
        let error: string | null = null;
        
        try {
            match = this.matches.getMatchByWebSocket(ws);
            if (!match) {
                throw new Error('Attempt to disconnect player who is not in a match');
            }

            const player = match.findPlayer({ws});
            if (!player) {
                throw new Error("Disconnect report when player not connected");
            }

            player.disconnect();
        } catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
            console.error('Error during player disconnect:', error);
        }

        const trigger : WsResponseTrigger = { clientConnection: true };
        if (match) {
            broadcastMatchData( match, trigger, error );
        } else {
            const response: WsServerResponse = { trigger, matchData: null, error };
            ws.send(JSON.stringify(response));
        }
    }

    // Handle a player-requested action (move, end turn, etc)
    actionRequest(ws: WebSocket, str: string) {

        let match: Match | null = null;
        let error: string | null = null;
        let clientRequest: WsClientRequest | null = null;

        try {
            match = this.matches.getMatchByWebSocket(ws);
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

            if (isWsEndTurn(clientRequest)) {
                match.events.endTurn();
            } else if (isWsEndMatch(clientRequest)) {
                match.events.endMatch();
            } else if (isWsMoveRequest(clientRequest)) {
                match.move(clientRequest, player.id);
            } else {
                // In practice this should happen only if there is a missing case
                // in the if/else tests above.
                throw new Error("Unrecognised client request");
            }
        } catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
            console.error(`Error: ${error} when processing client request ${str}`);
        }

        if(match && clientRequest) {
            broadcastMatchData(match, clientRequest, error);
        } else if (clientRequest) {
            const response: WsServerResponse = { trigger: clientRequest, matchData: null, error };
            ws.send(JSON.stringify(response));
        }
    }

    error(_ws: WebSocket, error: Error) {
        // What should be done here?
        console.error('WebSocket error:', error);
    }
}

function broadcastMatchData(
    match: Match, 
    trigger: WsResponseTrigger,
    error: string | null
) { 
    const response: WsServerResponse = 
        { trigger, matchData: match.matchData(), error };

    for (const player of match.players) {
        const ws = player.getWs();
        if (ws) {
            ws.send(JSON.stringify(response));
        }
    }
}