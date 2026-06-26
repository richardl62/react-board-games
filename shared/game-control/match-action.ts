import { ActiveMatchState, MatchState } from '../match-state.js';
import { PublicPlayerMetadata } from '../lobby/types.js';
import { RandomAPI } from '../utils/random-api.js';
import { Ctx, endMatch, endTurn } from './ctx.js';
import { AllActive, GameControl } from './game-control.js';
import { MoveArg0, getMoveFunction, isOutOfSequenceMove } from './move-fn.js';

// The result of a move: the new ActiveMatchState plus the updated per-player data
// (a clone of the input playerData with any setPlayerData mutations applied).
export interface MoveResult extends ActiveMatchState {
  playerData: PublicPlayerMetadata[];
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
  const { state, ctxData, playerData: clonedPlayerData } = structuredClone(matchState);
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

  const arg0: MoveArg0<unknown> = {
    G: state,
    ctx,
    viewingPlayer: playerID,
    random,
    events: {
      endTurn: () => endTurn(ctxData),
      endMatch: () => endMatch(ctxData),
    },
    setPlayerData: outOfSequence
      ? (playerId, data) => {
          const p = clonedPlayerData.find((pd) => pd.id === playerId);
          if (p) p.gameData = data;
        }
      : () => {
          throw new Error(`Move "${moveName}" called setPlayerData but is not an out-of-sequence move.`);
        },
    getPlayerData: outOfSequence
      ? (playerId) => clonedPlayerData.find((p) => p.id === playerId)?.gameData
      : () => {
          throw new Error(`Move "${moveName}" called getPlayerData but is not an out-of-sequence move.`);
        },
  };

  getMoveFunction(moveDef)(arg0, param);

  return { state, ctxData, prngState: random.getState(), playerData: clonedPlayerData };
}
