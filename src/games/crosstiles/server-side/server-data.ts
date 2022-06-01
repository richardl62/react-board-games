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
    settingOptions = "set options",
    pollingForReady = "polling for ready",
    makingGrids = "making grids",
    scoring = "scoring",
    gameOver = "game over",
}

type Grid = (Letter | null) [][];

interface PlayerData {
    ready: boolean;
    grid: Grid | null;
    scoreCard: ScoreCard;
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
            ready: false,
            grid: null,
            scoreCard: startingScoreCard(),
            chosenCategory: null,
        };
    }

    const G = {
        options: defaultOptions,
        stage: GameStage.settingOptions,
        round: 0,
        selectedLetters: selectLetters(),
        playerData: playerData,
        serverError: null,
        timestamp: 0,
    };

    // Start of temporary code
    //startNextStage(G, ctx);
    //G.stage = GameStage.gameOver;
    // End of temporary code

    return G;
}