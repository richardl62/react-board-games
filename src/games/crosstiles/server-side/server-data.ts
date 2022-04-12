import { Ctx } from "boardgame.io";
import { Letter } from "../config";
import { newScoreCard, ScoreCard } from "./score-card";
import { selectTiles } from "./select-tiles";

/** Data recorded and shared via BGIO */
enum GameStage {
    pollingForReady,
    makingGrids,
    scoring,
    gameOver,
}

type Grid = Letter[][];

interface PlayerData {
    ready: boolean;
    grid: Grid | null;
    scoreCard: ScoreCard;
}

export interface ServerData {
    stage: GameStage;
    selectedLetters: Letter[];
    playerData: {[playerID: string]: PlayerData };

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
        selectedLetters: selectTiles(),

        playerData: playerData,

        serverError: null,
        timestamp: 0,
    };
}