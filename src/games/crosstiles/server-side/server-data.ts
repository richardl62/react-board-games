import { Ctx } from "boardgame.io";
import { ScoreCard } from "./score-card";
import { defaultOptions, Letter } from "../config";
import { selectLetters } from "./select-letters";
import { startingScoreCard } from "./score-card";
import { ScoreCategory } from "../score-categories";

export type GameOptions = {
    timeToMakeGrid: number;
    checkSpelling: boolean;
};

/* Use string values to add with debugging */
export enum GameStage {
    setup = "setup",
    starting = "starting",
    makingGrids = "making grids",
    scoring = "scoring",
    over = "over",
}

type Grid = (Letter | null) [][];

interface PlayerData {
    readyToStartGame: boolean;
    readyForNextRound: boolean;
    grid: Grid | null;
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

    selectedLetters: Letter[];

    serverError: string | null;
    timestamp: number;
}

export function startingServerData(ctx: Ctx): ServerData {

    const playerData : {[playerID: string]: PlayerData } = {};
    
    for(const pid in ctx.playOrder) {
        playerData[pid] = {
            readyToStartGame: false,
            readyForNextRound: false,
            doneRecordingGrid: false,
            grid: null,
            scoreCard: startingScoreCard(),
            makeGridStartTime: null,
            chosenCategory: null,
        };
    }

    const G = {
        options: defaultOptions,
        stage: GameStage.setup,
        round: 0,
        selectedLetters: selectLetters(ctx),
        playerData: playerData,
        serverError: null,
        timestamp: 0,
    };


    return G;
}
