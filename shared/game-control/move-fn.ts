import { Ctx } from './ctx.js';
import { EventsAPI } from './events.js';
import { PlayerID } from './playerid.js';
import { RandomAPI } from '../utils/random-api.js';

export interface MoveArg0<G> {
  G: G;
  ctx: Ctx;
  viewingPlayer: PlayerID;
  random: RandomAPI;
  events: EventsAPI;
  // Update the game-defined per-player data for the given player. The value is
  // stored in PublicPlayerMetadata.gameData and broadcast to all clients.
  // Calling this for a player other than viewingPlayer sets changesOtherPlayersData
  // on the server response, causing clients to discard their optimistic chain.
  setPlayerData: (playerId: PlayerID, data: unknown) => void;
}

export type MoveFn<G> = (
  context: MoveArg0<G>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arg: any,
) => void;

export type ClientMoveFunctions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functions extends Record<string, MoveFn<any>>,
> = {
  [Name in keyof functions]: (arg: Parameters<functions[Name]>[1]) => void;
};
