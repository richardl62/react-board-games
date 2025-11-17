import WebSocket from "ws";
import url from 'url';
import { Matches } from "./matches.js";
import { WsMatchResponse } from "../shared/ws-match-response.js";
import { isWsMatchRequest, isWsEndTurn } from "../shared/ws-match-request.js"
import { Match } from "./match.js";

export class Connections {
    matches: Matches;

    constructor(matches: Matches) {
        this.matches = matches;
    }

    connection(ws: WebSocket, requestUrl: string | undefined) {

        if (requestUrl) {
            try {
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

                const match = this.matches.findMatch(parseInt(matchID, 10));
                if (!match) {
                    throw new Error(`Match ${matchID} not found - cannot record connection`);
                }

                const player = match.findPlayer(playerID);
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

                broadcastMatchData(match, { error: null });
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "unknown error";

                console.log('Error during connection:', message);

                const response: WsMatchResponse = { error: message, matchData: null };
                ws.send(JSON.stringify(response));
            }
        }
    }

    matchRequest(ws: WebSocket, str: string) {
        let error = null;
        let match;

        try {
            match = this.matches.getMatchByWebSocket(ws);
            if (!match) {
                throw new Error('Player not in a match');
            }

            const matchRequest = JSON.parse(str);
            if (!isWsMatchRequest(matchRequest)) {
                throw new Error("Unexpected data with match request: " + str);
            }

            if (isWsEndTurn(matchRequest)) {
                match.endTurn();
            } else {
                match.move(matchRequest);
            }

        } catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
        }

        if (match) {
            broadcastMatchData(match, { error });
        } else {
            // Hmm. Not sure what to do here.
            console.error('No match found for this WebSocket in move request');
        }
    }

    close(ws: WebSocket) {
        try {
            const match = this.matches.getMatchByWebSocket(ws);
            if (!match) {
                throw new Error('Attempt to disconnect player who is not in a match');
            }

            const player = match.findPlayer(ws);
            if (!player) {
                throw new Error("Disconnect report when player not connected");
            }

            player.disconnect();

            broadcastMatchData(match, { error: null });
        } catch (err) {
            // Hmm. Not sure what to do here.
            console.error('Error during player disconnect:', err);
        }
    }

    error(_ws: WebSocket, error: Error) {
        // What should be done here?
        console.error('WebSocket error:', error);
    }
}

function broadcastMatchData(match: Match, { error }: { error: string | null }) {
    const matchData = match.matchData();
    const response: WsMatchResponse = { matchData, error };

    for (const player of match.players) {
        const ws = player.getWs();
        if (ws) {
            ws.send(JSON.stringify(response));
        }
    }
}