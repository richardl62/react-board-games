// Rematch requests are handled by the server in online matches (Match.handleRematchRequest)
// and by applyRematchRequest in offline matches. These tests run the same scenarios
// against both, to check that they behave in the same way.
//
// (This file is in the client, rather than the server, as the server's tsconfig
// excludes test files.)
import { describe, expect, test } from 'vitest';
import { Match } from '../../../../server/match.js';
import { gameControl } from '@game-control/games/plus-minus/game-control';
import { RandomAPI } from '@shared/utils/random-api';
import { WsRematchRequest } from '@shared/ws-rematch-request';
import { sAssert } from '@shared/utils/assert';
import { applyRematchRequest, OfflineRematchState } from './apply-rematch-request';

const playerIDs = ['0', '1', '2'];

// What a scenario can do to, and find out about, an implementation.
interface Harness {
  // Returns the seed used to restart the match, or null if the match was not restarted.
  request: (playerID: string, request: WsRematchRequest) => number | null;

  // The IDs of the players who currently want a rematch.
  wanting: () => string[];
}

function makeServerHarness(): Harness {
  const match = new Match(gameControl, {
    matchID: 'test',
    numPlayers: playerIDs.length,
    setupData: { startingValue: 0 },
    matchOptions: { supportGameControls: true },
    randomAPI: RandomAPI.fromSeed(0.5),
  });
  for (const id of playerIDs) {
    match.allocatePlayer(`Player ${id}`);
  }

  // Record the seed used by any restart.
  let restartSeed: number | null = null;
  const originalRestart = match.restart.bind(match);
  match.restart = (seed: number) => {
    restartSeed = seed;
    originalRestart(seed);
  };

  return {
    request: (playerID, request) => {
      const player = match.findPlayer({ id: playerID });
      sAssert(player, `Player ${playerID} not found`);

      restartSeed = null;
      const restarted = match.handleRematchRequest(player, request);
      expect(restarted).toBe(restartSeed !== null);
      return restartSeed;
    },

    wanting: () =>
      match
        .matchState(null)
        .playerData.filter((p) => p.wantsRematch)
        .map((p) => p.id),
  };
}

function makeOfflineHarness(): Harness {
  const initialState = (): OfflineRematchState => ({
    playerData: playerIDs.map((id) => ({ id, name: `Player ${id}`, isConnected: true })),
    rematchSeed: null,
  });

  let state = initialState();

  return {
    request: (playerID, request) => {
      const { restart, ...newState } = applyRematchRequest(state, playerID, request);
      if (restart) {
        // As in useOfflineMatchState, a restart gives a fresh state.
        state = initialState();
        return newState.rematchSeed;
      }

      state = newState;
      return null;
    },

    wanting: () => state.playerData.filter((p) => p.wantsRematch).map((p) => p.id),
  };
}

const propose = (randomSeed: number): WsRematchRequest => ({ rematch: 'propose', randomSeed });
const accept: WsRematchRequest = { rematch: 'accept' };
const decline: WsRematchRequest = { rematch: 'decline' };

describe.each([
  ['server', makeServerHarness],
  ['offline', makeOfflineHarness],
])('rematch requests: %s', (_name, makeHarness) => {
  test('nobody wants a rematch at the start', () => {
    const harness = makeHarness();
    expect(harness.wanting()).toEqual([]);
  });

  test('propose marks just the proposer', () => {
    const harness = makeHarness();
    expect(harness.request('1', propose(0.1))).toBeNull();
    expect(harness.wanting()).toEqual(['1']);
  });

  test('accept marks the accepter', () => {
    const harness = makeHarness();
    harness.request('1', propose(0.1));
    expect(harness.request('2', accept)).toBeNull();
    expect(harness.wanting()).toEqual(['1', '2']);
  });

  test('accept with no proposal is ignored', () => {
    const harness = makeHarness();
    expect(harness.request('1', accept)).toBeNull();
    expect(harness.wanting()).toEqual([]);
  });

  test('repeated requests from one player do not restart the match', () => {
    const harness = makeHarness();
    harness.request('1', propose(0.1));
    expect(harness.request('1', propose(0.2))).toBeNull();
    expect(harness.request('1', accept)).toBeNull();
    expect(harness.wanting()).toEqual(['1']);
  });

  test('decline by another player cancels the proposal', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', accept);
    expect(harness.request('2', decline)).toBeNull();
    expect(harness.wanting()).toEqual([]);
  });

  test('decline by the proposer (i.e. withdrawal) cancels the proposal', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', accept);
    expect(harness.request('0', decline)).toBeNull();
    expect(harness.wanting()).toEqual([]);
  });

  test('accept after a decline is ignored', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', decline);
    expect(harness.request('2', accept)).toBeNull();
    expect(harness.wanting()).toEqual([]);
  });

  test('decline with no proposal does nothing', () => {
    const harness = makeHarness();
    expect(harness.request('1', decline)).toBeNull();
    expect(harness.wanting()).toEqual([]);
  });

  test('the match restarts, with the proposer’s seed, once all players accept', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    expect(harness.request('1', accept)).toBeNull();
    expect(harness.request('2', accept)).toBe(0.1);
    expect(harness.wanting()).toEqual([]);
  });

  test('a second proposal is treated as an acceptance, keeping the first seed', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', propose(0.2));
    expect(harness.wanting()).toEqual(['0', '1']);
    expect(harness.request('2', propose(0.3))).toBe(0.1);
  });

  test('a new proposal after a decline uses the new seed', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', decline);
    harness.request('1', propose(0.2));
    harness.request('0', accept);
    expect(harness.request('2', accept)).toBe(0.2);
  });

  test('a rematch can be proposed again after a restart', () => {
    const harness = makeHarness();
    harness.request('0', propose(0.1));
    harness.request('1', accept);
    harness.request('2', accept);

    expect(harness.request('2', propose(0.4))).toBeNull();
    expect(harness.wanting()).toEqual(['2']);
    harness.request('0', accept);
    expect(harness.request('1', accept)).toBe(0.4);
  });
});
