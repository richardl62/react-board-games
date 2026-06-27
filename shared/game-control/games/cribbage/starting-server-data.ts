import { cardsPerHand } from './config.js';
import { SetupArg0, SetupResult } from '../../game-control.js';
import { RandomAPI } from '../../../utils/random-api.js';
import { Card } from '../../../utils/cards/types.js';
import { deckNoJokers } from '../../../utils/cards/deck.js';
import { GameStage, PegPositions, PlayerData, ServerData } from './server-data.js';
import { Ctx } from '../../ctx.js';
import { sAssert } from '../../../utils/assert.js';

function makePlayerData(cards: Card[], pegPos: PegPositions): PlayerData {
  const hand = cards.splice(0, cardsPerHand);

  return {
    hand,
    fullHand: [...hand],
    request: null,
    trailingPeg: pegPos.trailingPeg,
    score: pegPos.score,
  };
}

export interface NewDealResult {
  serverData: ServerData;
  playerData: Record<string, PlayerData>;
}

export function newDealData(
  ctx: Ctx,
  pegPositions: Record<string, PegPositions>,
  random: RandomAPI,
): NewDealResult {
  const cards = random.Shuffle(deckNoJokers());

  const playerData: Record<string, PlayerData> = {};
  for (const pid of ctx.playOrder) {
    const pegPos = pegPositions[pid];
    sAssert(pegPos, `Missing peg position for player ${pid}`);
    playerData[pid] = makePlayerData(cards, pegPos);
  }

  const serverData: ServerData = {
    shared: { hand: [] },
    box: [],
    stage: GameStage.SettingBox,
    cutCard: { card: cards.pop()!, visible: false },
  };

  return { serverData, playerData };
}

export function startingServerData({ ctx, random }: SetupArg0): SetupResult {
  const startingPegPositions: Record<string, PegPositions> = {};
  for (const pid of ctx.playOrder) {
    startingPegPositions[pid] = { score: 0, trailingPeg: -1 };
  }

  const { serverData, playerData } = newDealData(ctx, startingPegPositions, random);
  return { state: serverData, playerData };
}
