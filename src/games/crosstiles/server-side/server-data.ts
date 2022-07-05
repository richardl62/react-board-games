import { Ctx } from "boardgame.io";
import { ScoreCard } from "./score-card";
import { defaultOptions, Letter } from "../config";
import { startingScoreCard } from "./score-card";
import { ScoreCategory } from "../score-categories";
import { ScoreWithCategory } from "./set-score";

export type GameOptions = {
    timeToMakeGrid: number;
    checkSpelling: boolean;
    playersGetSameLetters: boolean;
};

/* Use string values to add with debugging */
export enum GameStage {
    setup = "setup",
    starting = "starting",
    makingGrids = "making grids",
    scoring = "scoring",
    over = "over",
}

interface GridAndScore {
    grid: (Letter | null) [][];
    score: ScoreWithCategory | null;
}

interface PlayerData {
    readyToStartGame: boolean;
    readyForNextRound: boolean;
    selectedLetters: Letter[] | null;
    gridAndScore: GridAndScore | null;
    doneRecordingGrid: boolean;
    scoreCard: ScoreCard;
    makeGridStartTime: number | null;
    chosenCategory: ScoreCategory | null;
}

export interface ServerData {
    options: GameOptions;
    stage: GameStage;
    round: number;

    playerData: {[playerID: string]: PlayerData };

    serverError: string | null;
    timestamp: number;
}

export function startingServerData(ctx: Ctx): ServerData {

    const playerData : {[playerID: string]: PlayerData } = {};
    
    for(const pid in ctx.playOrder) {
        playerData[pid] = {
            selectedLetters: null,
            readyToStartGame: false,
            readyForNextRound: false,
            doneRecordingGrid: false,
            gridAndScore: null,
            scoreCard: startingScoreCard(),
            makeGridStartTime: null,
            chosenCategory: null,
        };
    }

    const G = {
        options: defaultOptions,
        stage: GameStage.setup,
        round: 0,
        playerData: playerData,
        serverError: null,
        timestamp: 0,
    };


    return G;
}
