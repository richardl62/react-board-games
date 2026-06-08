import { ActiveMatchState } from '../match-state.js';
import { RandomAPI } from '../utils/random-api.js';
import { Ctx, endMatch, endTurn } from './ctx.js';
import { AllActive, GameControl } from './game-control.js';
import { MoveArg0 } from './move-fn.js';

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
  matchState: Readonly<ActiveMatchState>,
  param: Param,
): ActiveMatchState {
  const { state, ctxData } = structuredClone(matchState);
  const random = RandomAPI.fromState(matchState.prngState);

  const ctx = new Ctx(ctxData);
  const arg0: MoveArg0<unknown> = {
    G: state,
    ctx,
    viewingPlayer: playerID,
    random,
    events: {
      endTurn: () => endTurn(ctxData),
      endMatch: () => endMatch(ctxData),
    },
  };

  const func = gameControl.moves[moveName];
  if (!func) {
    throw new Error(`Move "${moveName}" not found in game ${gameControl.name}`);
  }

  if (ctx.matchover) {
    throw new Error('Move attempted after match is over.');
  }

  if (ctx.currentPlayer !== playerID && gameControl.turnOrder !== AllActive) {
    throw new Error(`It is not player ${playerID}'s turn.`);
  }

  func(arg0, param);

  return { state, ctxData, prngState: random.getState() };
}
