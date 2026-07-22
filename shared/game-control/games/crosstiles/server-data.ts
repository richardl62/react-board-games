import { SetupArg0, SetupResult } from '../../game-control.js';
import { Ctx } from '../../ctx.js';
import { Letter } from './config.js';
import { ScoreCategory } from './score-categories.js';
import { ScoreCard, startingScoreCard } from './moves/score-card.js';
import { ScoreWithCategory } from './moves/set-score.js';

export interface SetupOptions {
  readonly timeToMakeGrid: number;
  readonly makeGridCountdown: number;
  readonly rackSize: number;
  readonly minVowels: number;
  readonly minConsonants: number;
  readonly minBonusLetters: number;
  readonly playersGetSameLetters: boolean;
  readonly checkGridBeforeRecoding: boolean;
  readonly checkSpelling: boolean;
}

/* Use string values to add with debugging */
export enum GameStage {
  starting = 'starting',
  makingGrids = 'making grids',
  scoring = 'scoring',
  over = 'over',
}

interface GridRackAndScore {
  grid: (Letter | null)[][];
  rack: (Letter | null)[];
  score: ScoreWithCategory | null;
}

export interface PlayerData {
  readyToStartGame: boolean;
  readyForNewGame: boolean;
  readyForNextRound: boolean;
  selectedLetters: Letter[] | null;
  gridRackAndScore: GridRackAndScore | null;
  doneRecordingGrid: boolean;
  scoreCard: ScoreCard;
  /**
   * makeGridStartTime is recorded on the server to ensure it is
   * preserved when the browser is refresheed. It is in PlayerData to avoid
   * any issues caused by different clock settings on different machines.
   */
  makeGridStartTime: number | null;
  chosenCategory: ScoreCategory | null;
}

export interface ServerData {
  options: SetupOptions;
  stage: GameStage;
  round: number;
}

export function startingPlayerData(): PlayerData {
  return {
    selectedLetters: null,
    readyToStartGame: false,
    readyForNewGame: false,
    readyForNextRound: false,
    doneRecordingGrid: false,
    gridRackAndScore: null,
    scoreCard: startingScoreCard(),
    makeGridStartTime: null,
    chosenCategory: null,
  };
}

export interface InitialGameData {
  state: ServerData;
  playerData: Record<string, PlayerData>;
}

// Used both for the initial game setup and, mid-game, by readyForNewGame.
export function initialGameData(ctx: Ctx, options: SetupOptions): InitialGameData {
  const playerData: Record<string, PlayerData> = {};

  for (const pid of ctx.playOrder) {
    playerData[pid] = startingPlayerData();
  }

  return {
    state: {
      stage: GameStage.starting,
      round: 0,
      options,
    },
    playerData,
  };
}

export function startingServerData({ ctx }: SetupArg0, options: SetupOptions): SetupResult {
  return initialGameData(ctx, options);
}
