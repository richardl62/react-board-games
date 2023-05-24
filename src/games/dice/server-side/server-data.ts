import { SetupArg0 } from "../../../app-game-support/bgio-types";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

export interface ServerData extends RequiredServerData{
    faces: number[];
    held: boolean[];
    scoreToBeat: number;
    scoreThisTurn: {
        current: number;
        carriedOver: number;
    }
    rollCount: number;
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
        rollCount: 0,
        scoreToBeat: 0,
        scoreThisTurn: {
            /** The score from the dice, excludes scores carried over from earlier in the turn */
            current: 0,

            /** The score carried over from earlier in the turn */
            carriedOver: 0,
        },
        ...startingRequiredState(),
    };
}
