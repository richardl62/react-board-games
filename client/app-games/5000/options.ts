import { SetupOptions } from "@game-control/games/5000/server-data";
import { SpecifiedValues } from "../../option-specification/types";
import { assertType, Equal } from "@utils/assert-type";

export const setupOptions = {
    scoreToWin: {
        default: 5000,
        label: "Score to win",
    },
    mustBeatPreviousScores: {
        default: true,
        label: "Must beat previous scores",
    },
    alwaysFinishRound: {
        default: true,
        label: "Always finish round",
    },
    manualDiceRolls: {
        default: false,
        label: "Allow manual dice rolls",
        debugOnly: true,
    },
    neverBust: {
        default: false,
        label: "Never bust",
        debugOnly: true,
    },
} as const;


assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();