import WebSocket from 'ws';
import { wsClientConnection } from '../shared/ws-response-trigger.js';
import { Matches } from './matches.js';
import { closeWithReason } from './web-socket-actions.js';

const connectionFlags = new WeakMap<WebSocket, { suppressDisconnectionActions: boolean }>();

function getFlags(ws: WebSocket) {
  let flags = connectionFlags.get(ws);
  if (!flags) {
    flags = { suppressDisconnectionActions: false };
    connectionFlags.set(ws, flags);
  }
  return flags;
}

// Return the value of the named URL parameter from the given request URL.
// Throw an error if the parameter is missing or invalid.
function urlParam(requestUrl: string | undefined, name: string) {
  if (!requestUrl) throw new Error('Unexpected null request URL');

  const parsed = new URL(requestUrl, 'http://localhost' /* dummy base URL */);
  const param = parsed.searchParams.get(name);

  if (!param) {
    throw new Error(`URL parameter "${name}" missing or invalid`);
  }
  return param;
}

// Asynchronous, as the match may need to be restored from the saved live matches
// (e.g. after a server restart). Does not reject.
export async function processConnection(
  matches: Matches,
  ws: WebSocket,
  requestUrl: string | undefined,
): Promise<void> {
  try {
    const matchID = urlParam(requestUrl, 'matchID');
    const playerID = urlParam(requestUrl, 'playerID');
    const credentials = urlParam(requestUrl, 'credentials');

    try {
      await matches.ensureLoaded(matchID);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'unknown error';
      console.error(`Failed to load match ${matchID}:`, error);

      // Close without using a private (4000-4999) code, so the client will retry.
      getFlags(ws).suppressDisconnectionActions = true;
      ws.close(1011, 'Unable to load match'); // 1011: 'Internal Error'
      return;
    }

    if (ws.readyState !== ws.OPEN) {
      // The connection was closed while the match was being loaded.
      getFlags(ws).suppressDisconnectionActions = true;
      return;
    }

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

    // Test action: reject (re)connection attempts while blocked. No reason is given,
    // so the client will keep retrying with its normal reconnection backoff.
    if (player.isReconnectionBlocked) {
      ws.close();
      return;
    }

    // KLUDGE? If the player is already connected, terminate the previous connection.
    // This is primarily intended for the case where a player starts a match
    // on one device, then continues it on another device without closing the first
    // connection. (The easy options are either this or disallowing the new connection,
    // and this option seems more user-friendly.)
    if (player.isConnected) {
      const ws = player.getWs();
      getFlags(ws).suppressDisconnectionActions = true;
      closeWithReason(player.getWs(), 'player connected elsewhere');
    }

    player.recordConnection(ws);

    match.broadcastMatchState(wsClientConnection(player.id), null);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'unknown error';
    console.log('Error during connection:', error);

    getFlags(ws).suppressDisconnectionActions = true;
    closeWithReason(
      ws,
      'unrecognised match or player', // Short reason suitable for human clients.
    );
  }
}

export function processDisconnection(matches: Matches, ws: WebSocket) {
  if (getFlags(ws).suppressDisconnectionActions) {
    return;
  }

  try {
    const found = matches.findMatchAndPlayer(ws);
    if (!found) {
      console.log('Disconnect reported from socket with no associated player/match');
      return;
    }

    const { match, player } = found;

    player.recordDisconnection();

    match.broadcastMatchState(wsClientConnection(player.id), null);
  } catch (err) {
    // Hmm. Not sure what best to do as we cannot send error response to disconnected player.
    const error = err instanceof Error ? err.message : 'unknown error';
    console.error('Error during player disconnect:', error);
  }
}
