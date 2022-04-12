import { Ctx } from "boardgame.io";
import { Letter } from "../config";
import { newScoreCard, ScoreCard } from "./score-card";

/* Use string values to add with debugging */
export enum GameStage {
    pollingForReady = "polling for ready",
    makingGrids = "making grids",
    scoring = "scoring",
    gameOver = "game over",
}

type Grid = Letter[][];

interface PlayerData {
    ready: boolean;
    grid: Grid | null;
    scoreCard: ScoreCard;
}

export interface ServerData {
    stage: GameStage;
    playerData: {[playerID: string]: PlayerData };
    selectedLetters: Letter[] | null;

    serverError: string | null;
    timestamp: number;
}

export function startingServerData(ctx: Ctx): ServerData {

    const playerData : {[playerID: string]: PlayerData } = {};
    
    for(const pid in ctx.playOrder) {
        playerData[pid] = {
            ready: false,
            grid: null,
            scoreCard: newScoreCard(),
        };
    }

    return {
        stage: GameStage.pollingForReady,
        selectedLetters: null,
        playerData: playerData,

        serverError: null,
        timestamp: 0,
    };
}