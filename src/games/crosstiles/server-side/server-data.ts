import { Letter } from "../config";
import { selectTiles } from "./select-tiles";

/** Data recorded and shared via BGIO */
enum GameStage {
    pollingForReady,
    makingGrids,
    scoring,
    gameOver,
}

type Grid = Letter[][];

interface ScoreCard {
    lenght3: number;
    length4: number;
    length5: number;
}

interface PlayerData {
    ready: boolean;
    grid: Grid;
    scoreCard: ScoreCard;
}

export interface ServerData {
    stage: GameStage;
    selectedLetters: Letter[];
    playerData: {[playerID: string]: PlayerData };

    serverError: string | null;
    timestamp: number;
}

export function startingServerData(): ServerData {
    return {
        stage: GameStage.pollingForReady,
        selectedLetters: selectTiles(),

        playerData: {},

        serverError: null,
        timestamp: 0,
    };
}