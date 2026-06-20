import WebSocket from 'ws';
import { isWsEndTurn, isWsEndMatch, isWsMove } from '../shared/ws-requested-action.js';
import { isWsClientRequest } from '../shared/ws-client-request.js';
import { isWsCloseConnection, isWsResponseDelay } from '../shared/ws-test-actions.js';
import { Matches } from './matches.js';
import { closeWithReason } from './web-socket-actions.js';

// Throw if there is an error that prevent the requested action being attempted, for example
// if the web socket is not associated with a player. Other errors (for example invalid moves)
// are caught and reported back to the client via broadcastMatchState.
function doProcessActionRequest(matches: Matches, ws: WebSocket, request: string) {
  const found = matches.findMatchAndPlayer(ws);
  if (!found) {
    throw new Error('WebSocket not associated with a player');
  }
  const { match, player } = found;

  const clientRequest: unknown = JSON.parse(request);

  // Process test actions
  if (isWsCloseConnection(clientRequest)) {
    // Test action.
    if (clientRequest.reconnection === 'prevent') {
      // Close with a code that tells the client not to attempt reconnection.
      ws.close(4001, 'Connection closed by server (no reconnection)');
      return;
    }

    const blockMs = clientRequest.reconnection.blockedMs;
    if (blockMs > 0) {
      player.blockReconnectionUntil(Date.now() + blockMs);
    }

    //  Close without giving a reasons (this should trigger
    // the client to attempt to reconnect).
    ws.close();
    return;
  }

  if (isWsResponseDelay(clientRequest)) {
    match.setResponseDelay(clientRequest.responseDelay);
    return;
  }

  // Now process normal client requests.
  if (!isWsClientRequest(clientRequest)) {
    throw new Error('WebSocket received invalid data');
  }

  let error: string | null = null;
  let changesOtherPlayersData = false;
  try {
    if (isWsEndTurn(clientRequest.action)) {
      match.endTurn();
    } else if (isWsEndMatch(clientRequest.action)) {
      match.endMatch();
    } else if (isWsMove(clientRequest.action)) {
      changesOtherPlayersData = match.move(clientRequest.action, player.id);
    } else {
      // Should never happen.
      throw new Error('Unrecognised client request');
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'unknown error';
    console.warn(`Error: ${error} when processing client request ${request}`);
  }

  match.broadcastMatchState(clientRequest, error, changesOtherPlayersData);
}

// Handle a player-requested action (move, end turn, etc)
export function processActionRequest(matches: Matches, ws: WebSocket, request: string) {
  try {
    doProcessActionRequest(matches, ws, request);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'unknown error';
    console.warn(`Error: ${error} when processing client request ${request}`);
    closeWithReason(ws, 'bad data received');
  }
}
