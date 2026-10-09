import { expect, test } from 'vitest';
import { PublicPlayerMetadata } from '@shared/lobby/types';
import { applyRematchRequest, OfflineRematchState } from './apply-rematch-request';

function makeState(wanting: string[], rematchSeed: number | null): OfflineRematchState {
  const playerData: PublicPlayerMetadata[] = ['0', '1', '2'].map((id) => {
    const meta: PublicPlayerMetadata = { id, name: `Player ${id}`, isConnected: true };
    if (wanting.includes(id)) {
      meta.wantsRematch = true;
    }
    return meta;
  });
  return { playerData, rematchSeed };
}

function wantingIDs(state: OfflineRematchState): string[] {
  return state.playerData.filter((p) => p.wantsRematch).map((p) => p.id);
}

test('propose sets the seed and marks the proposer', () => {
  const result = applyRematchRequest(makeState([], null), '1', {
    rematch: 'propose',
    randomSeed: 0.5,
  });
  expect(result.rematchSeed).toBe(0.5);
  expect(wantingIDs(result)).toEqual(['1']);
  expect(result.restart).toBe(false);
});

test('a second proposal is treated as an acceptance and keeps the original seed', () => {
  const result = applyRematchRequest(makeState(['0'], 0.5), '1', {
    rematch: 'propose',
    randomSeed: 0.9,
  });
  expect(result.rematchSeed).toBe(0.5);
  expect(wantingIDs(result)).toEqual(['0', '1']);
});

test('accept with no proposal is ignored', () => {
  const result = applyRematchRequest(makeState([], null), '1', { rematch: 'accept' });
  expect(result.rematchSeed).toBeNull();
  expect(wantingIDs(result)).toEqual([]);
  expect(result.restart).toBe(false);
});

test('decline clears the proposal', () => {
  const result = applyRematchRequest(makeState(['0', '1'], 0.5), '0', { rematch: 'decline' });
  expect(result.rematchSeed).toBeNull();
  expect(wantingIDs(result)).toEqual([]);
  expect(result.playerData.every((p) => !('wantsRematch' in p))).toBe(true);
});

test('restart once all players want a rematch', () => {
  const result = applyRematchRequest(makeState(['0', '1'], 0.5), '2', { rematch: 'accept' });
  expect(result.restart).toBe(true);
  expect(result.rematchSeed).toBe(0.5);
});

test('input state is not modified', () => {
  const state = makeState(['0'], 0.5);
  const copy = structuredClone(state);
  applyRematchRequest(state, '1', { rematch: 'accept' });
  applyRematchRequest(state, '1', { rematch: 'decline' });
  expect(state).toEqual(copy);
});

test('unknown player throws', () => {
  expect(() => applyRematchRequest(makeState([], null), '9', { rematch: 'accept' })).toThrow();
});
