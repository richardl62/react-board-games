import { Ctx } from "boardgame.io";
import { ScoreCard } from "./score-categories";
import { Letter } from "../config";
import { startNextStage } from "./start-next-stage";

/* Use string values to add with debugging */
export enum GameStage {
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
}

export interface ServerData {
    stage: GameStage;
    round: number;

    playerData: {[playerID: string]: PlayerData };

    playerToScore: string | null;
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
            scoreCard: {},
        };
    }

    const G = {
        stage: GameStage.pollingForReady,
        round: 0,
        selectedLetters: null,
        playerData: playerData,
        playerToScore: null,
        serverError: null,
        timestamp: 0,
    };

    // Start of temporary code
    startNextStage(G, ctx);
    for (const pid in G.playerData) { 
        G.playerData[pid].grid = [
            [null]
        ];
    }
    // End of temporary code

    return G;
}