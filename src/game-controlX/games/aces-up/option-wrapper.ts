import { CardNonJoker } from "@/utils/cards";
import { StartingOptions } from "./server-data";

export class OptionWrapper {
    constructor(opts: StartingOptions) {
        this.opts = opts;
    }
    opts: StartingOptions;

    isTopRank(card: CardNonJoker): boolean {
        return card.rank === this.opts.topRank;
    }

    isThief(card: CardNonJoker): boolean {
        return card.rank === this.opts.thiefRank;
    }

    isKiller(card: CardNonJoker): boolean {
        return card.rank === this.opts.killerRank;
    }

    isSpecial(card: CardNonJoker): boolean {
        return this.isKiller(card) || this.isThief(card) || card.rank === "K";
    }
}
