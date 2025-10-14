import { assertType, Equal } from "@/utils/assert-type";
import { Rank } from "../../../utils/cards/types";
import { SetupOptions } from "./setup-options";
import { StartingOptions } from "@/game-controlX/games/aces-up/server-data";

export interface GameOptions extends Omit<SetupOptions, "jacksAndQueensSpecial"> {
    /* The highest rank excluding special cards. When a shared
    pile reaches this rank it is full */
    readonly topRank: Rank;

    /* A thief steals the card it is placed on */
    readonly thiefRank: Rank | null;

    /* A killer clears the pile is is placed on */
    readonly killerRank: Rank | null;
}

assertType<Equal<StartingOptions, GameOptions>>();

export function makeGameOptions(opts: SetupOptions) : GameOptions {
    const specialRanks = opts.jacksAndQueensSpecial ?
        {
            topRank: "10",
            thiefRank: "J",
            killerRank: "Q",
        } as const
        : {
            topRank: "Q",
            thiefRank: null,
            killerRank: null,
        } as const;

    return { ...opts, ...specialRanks };
}

