import { SetupArg0 } from "../../../app-game-support/bgio-types";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

export interface ServerData extends RequiredServerData{
    faces: number[];
    held: boolean[];
    scoreToBeat: number;
    scoreCarriedOver: number;

    /** The score from the dice, excludes scores carried over from earlier in the turn */
    diceScores: {
        held: number;
        heldCategories: string[];
        max: number;
        prevRollHeld: number;
    }

    rollCount: number;
    bustRollCount: number;
}

export function startingServerData(_arg0: SetupArg0, options: SetupOptions): ServerData {
    const faces = [];
    const held = [];
    for (let i = 0; i < options.numberOfDice; i++) {
        faces.push((i % 6) + 1); // For now
        held.push(false);
    }

    return {
        faces,
        held,

        scoreToBeat: 0,
        scoreCarriedOver: 0,

        /** The score from the dice, excludes scores carried over from earlier in the turn */
        diceScores: {
            held: 0,
            heldCategories: [],

            max: 0,

            prevRollHeld: 0,
        },
        
        rollCount: 0,
        bustRollCount: -1,

        ...startingRequiredState(),
    };
}
