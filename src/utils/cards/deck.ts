import { Ctx } from "boardgame.io";
import { sAssert } from "../assert";
import { Card, ranks, suits } from "./types";

// Inefficient if called multiple times (could cache a deck)

export function deck(ctx: Ctx, options: { jokers: boolean; shuffled: boolean}): Card[] {
    const cards: Card[] = [];
    for (const rank of ranks) {
        for (const suit of suits) {
            cards.push({ rank: rank, suit: suit });
        }
    }

    if (options.jokers) {
        cards.push({ joker: 1 });
        cards.push({ joker: 2 });
    }

    if (options.shuffled) {
        sAssert(ctx.random);
        ctx.random.Shuffle(cards);
    }
    return cards;
}
