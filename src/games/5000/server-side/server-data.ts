import { SetupArg0 } from "../../../app-game-support/bgio-types";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

const numberOfDice = 6;

export interface ServerData extends RequiredServerData{
    faces: number[];
    held: boolean[];

    /** Null if the 'must beat previous scores' option is off */
    scoreToBeat: {value: number, setBy: string} | null;

    scoreCarriedOver: number;

    /** The score from the dice, excludes scores carried over from earlier in the turn */
    diceScores: {
        held: number;
        heldCategories: string[];

        nonScoringFaces: number[];

        max: number;
        prevRollHeld: number;
    }

    playerScores: {[playerID: string]: number[]};

    rollCount: number;
    turnOverRollCount: number;
}

export function startingServerData({ctx}: SetupArg0, options: SetupOptions): ServerData {
    const faces = [];
    const held = [];
    for (let i = 0; i < numberOfDice; i++) {
        faces.push((i % 6) + 1); // For now
        held.push(false);
    }
    
    const playerScores : ServerData["playerScores"] = {};

    for(const pid in ctx.playOrder) {
        playerScores[pid] = [];
    }

    const scoreToBeat = options.mustBeatPreviousScores ? 
        {value: 0, setBy: ""/*kludge*/} : null;
    
    return {
        faces,
        held,
        scoreToBeat,
        scoreCarriedOver: 0,

        /** The score from the dice, excludes scores carried over from earlier in the turn */
        diceScores: {
            held: 0,
            heldCategories: [],
            nonScoringFaces: [...faces],

            max: 0,

            prevRollHeld: 0,
        },

        playerScores,
        
        rollCount: 0,
        // Kludge?: Treat the start of the game as the end of a turn.
        turnOverRollCount: 0,

        ...startingRequiredState(),
    };
}
