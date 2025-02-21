import { SetupArg0 } from "../../../boardgame-lib/game";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { Letter } from "../config";
import { SetupOptions } from "../options";
import { ScoreCategory } from "../score-categories";
import { ScoreCard, startingScoreCard } from "./score-card";
import { ScoreWithCategory } from "./set-score";

/* Use string values to add with debugging */
export enum GameStage {
    starting = "starting",
    makingGrids = "making grids",
    scoring = "scoring",
    over = "over",
}

interface GridRackAndScore {
    grid: (Letter | null) [][];
    rack: (Letter | null) [],
    score: ScoreWithCategory | null;
}

interface PlayerData {
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

export interface ServerData extends RequiredServerData {
    options: SetupOptions;
    stage: GameStage;
    round: number;

    playerData: {[playerID: string]: PlayerData };
}

export function startingPlayerData() : PlayerData {
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

export function startingServerData({ctx}: SetupArg0, options: SetupOptions): ServerData 
{
    const playerData : {[playerID: string]: PlayerData } = {};
    
    for(const pid in ctx.playOrder) {
        playerData[pid] = startingPlayerData();
    }

    const G : ServerData = {
        stage: GameStage.starting,
        round: 0,
        playerData: playerData,
        options,
        ...startingRequiredState(),
    };


    return G;
}
