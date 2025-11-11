import WebSocket from "ws";
import url from 'url';
import { Matches } from "./matches.js";
import { WsMatchResponse } from "../shared/ws-match-response.js";
import { isWsMatchRequest} from "../shared/ws-match-request.js"

function errorResponse(
    err: unknown // The parameter from a catch statement 
  )
  {
    const message = err instanceof Error ? err.message : "unknown error";
    return JSON.stringify({ error: message });
  }

export class Connections {
    constructor(matches: Matches) {
        this.matches = matches;
    }
    matches: Matches;

    connection(ws: WebSocket, requestUrl: string | undefined) {
        
        if (requestUrl) {
          try {
            const parsedUrl = url.parse(requestUrl, true); // Does the 2nd parameter matter?
      
            const urlParam = (name: string) => {
              const param = parsedUrl.query[name];
      
              if (typeof param !== 'string') {
                throw new Error(`URL parameter "${name}" missing or invalid`);
              }
              return param;
            }
      
            const matchID = urlParam("matchID");
            const playerID = urlParam("playerID");
            //const credentials = urlParam("credentials");

            const match = this.matches.getMatch(parseInt(matchID));
      
            // the match is responsible for sending data if a connection is sucessful.
            match.connectPlayer(playerID, ws);
          }
          catch (err) {
            const message = err instanceof Error ? err.message : "unknown error";

            console.log('Error during connection:', message);

            const response: WsMatchResponse = {error: message, matchData: null};
            ws.send(JSON.stringify(response));
          }
        }
    }

    moveMessage(ws: WebSocket, str: string) {
        try {
            const matchRequest = JSON.parse(str);
            if (!isWsMatchRequest(matchRequest)) {
                 throw new Error("Unexpected data with move request: " + str);
            }
            
            this.matches.makeMove(ws, matchRequest);
        } catch (err) {
            ws.send(errorResponse(err));
        }
    }

    close(ws: WebSocket) {
        try {
            this.matches.playerDisconnected(ws);
        } catch (err) {
            ws.send(errorResponse(err)); // Does it makes sense to report an eror here?
        }
    }

    error(_ws: WebSocket, error: Error) {
        // What should be done here?
        console.error('WebSocket error:', error);
    }
}