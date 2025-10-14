import { CardNonJoker, Rank } from "../../../utils/cards/types";
import { SetupOptions } from "./setup-options";

export interface GameOptions extends Omit<SetupOptions, "jacksAndQueensSpecial"> {
    /* The highest rank excluding special cards. When a shared
    pile reaches this rank it is full */
    topRank: Rank;

    /* A thief steals the card it is placed on */
    thiefRank: Rank | null;

    /* A killer clears the pile is is placed on */
    killerRank: Rank | null;
}

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

export class OptionWrapper {
    constructor(opts: GameOptions) {
        this.opts = opts;
    }
    opts: GameOptions;

    isTopRank(card: CardNonJoker) : boolean {
        return card.rank === this.opts.topRank;
    }

    isThief(card: CardNonJoker) : boolean {
        return card.rank === this.opts.thiefRank;
    }

    isKiller(card: CardNonJoker) : boolean {
        return card.rank === this.opts.killerRank;
    }

    isSpecial(card: CardNonJoker) : boolean {
        return this.isKiller(card) || this.isThief(card) || card.rank === "K";
    }
}