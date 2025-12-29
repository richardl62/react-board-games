import { SetupArg0 } from "../../game-control.js";
const nDice = 6;

export interface ServerData {
    diceValues: number[];
}

export function startingServerData(_arg0: SetupArg0): ServerData {
    const diceValues: number[] = [];
    for (let i = 0; i < nDice; i++) {
        diceValues[i] = 1;
    }

    return {
        diceValues,
    }
}
