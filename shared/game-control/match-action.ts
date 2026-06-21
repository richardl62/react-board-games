import { ActiveMatchState, MatchState } from '../match-state.js';
import { RandomAPI } from '../utils/random-api.js';
import { Ctx, endMatch, endTurn } from './ctx.js';
import { AllActive, GameControl, getMoveFunction, isOutOfSequenceMove } from './game-control.js';
import { MoveArg0 } from './move-fn.js';

// The result of a move: the new ActiveMatchState plus any per-player data
// changes requested by the move via setPlayerData. playerDataChanges maps
// playerId -> new gameData value; empty object if setPlayerData was not called.
export interface MoveResult extends ActiveMatchState {
  playerDataChanges: Record<string, unknown>;
}

/**
 * Call a Game's move function, or throw if there is a problem.
 *
 * No input is modified except, possibly, random. (I could do better at
 * policing this.) Instead a (potentially) modified copy of matchState
 * is returned.
 */
export function matchMove<Param>(
  gameControl: Readonly<GameControl>,
  moveName: string,
  playerID: string,
  matchState: Readonly<MatchState>,
  param: Param,
): MoveResult {
  const { state, ctxData } = structuredClone(matchState);
  const random = RandomAPI.fromState(matchState.prngState);

  const moveDef = gameControl.moves[moveName];
  if (!moveDef) {
    throw new Error(`Move "${moveName}" not found in game ${gameControl.name}`);
  }

  const ctx = new Ctx(ctxData);

  if (ctx.matchover) {
    throw new Error('Move attempted after match is over.');
  }

  const outOfSequence = isOutOfSequenceMove(moveDef);
  if (!outOfSequence && ctx.currentPlayer !== playerID && gameControl.turnOrder !== AllActive) {
    throw new Error(`It is not player ${playerID}'s turn.`);
  }

  const playerDataChanges: Record<string, unknown> = {};
  const arg0: MoveArg0<unknown> = {
    G: state,
    ctx,
    viewingPlayer: playerID,
    random,
    events: {
      endTurn: () => endTurn(ctxData),
      endMatch: () => endMatch(ctxData),
    },
    setPlayerData: (playerId, data) => {
      playerDataChanges[playerId] = data;
    },
    getPlayerData: (playerId) => {
      if (Object.prototype.hasOwnProperty.call(playerDataChanges, playerId)) {
        return playerDataChanges[playerId];
      }
      return matchState.playerData.find((p) => p.id === playerId)?.gameData;
    },
  };

  getMoveFunction(moveDef)(arg0, param);

  return { state, ctxData, prngState: random.getState(), playerDataChanges };
}
