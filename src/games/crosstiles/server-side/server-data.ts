import { Ctx } from "boardgame.io";
import { ScoreCard } from "./score-card";
import { Letter } from "../config";
import { selectLetters } from "./select-letters";
import { startingScoreCard } from "./score-card";

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
        };
    }

    const G = {
        stage: GameStage.pollingForReady,
        round: 0,
        selectedLetters: selectLetters(),
        playerData: playerData,
        playerToScore: null,
        serverError: null,
        timestamp: 0,
    };

    // Start of temporary code
    //startNextStage(G, ctx);
    G.stage = GameStage.gameOver;
    // End of temporary code

    return G;
}