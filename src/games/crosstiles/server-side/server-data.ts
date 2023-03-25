import { Ctx } from "boardgame.io";
import { ScoreCard } from "./score-card";
import { Letter } from "../config";
import { startingScoreCard } from "./score-card";
import { ScoreCategory } from "../score-categories";
import { ScoreWithCategory } from "./set-score";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { GameOptions, setupOptions } from "../options";
import { asSpecifiedValues } from "../../../app/option-specification";
import { sAssert } from "../../../utils/assert";


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
    options: GameOptions;
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

export function startingServerData(ctx: Ctx, setupData: unknown): ServerData {
    const options = asSpecifiedValues(setupData, setupOptions);
    sAssert(options, "setupData does not have the expected type");

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
