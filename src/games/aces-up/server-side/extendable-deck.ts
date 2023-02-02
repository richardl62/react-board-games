import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { deck as drawDeck } from "../../../utils/cards/deck";

export class ExtendingDeck {
    constructor(ctx: Ctx, deck: Card[]) {
 
        this.ctx = ctx;
        this.deck = deck;
    }
    ctx: Ctx;
    deck: Card[];

    draw(nCards: number) : Card[] {
        if(nCards > this.deck.length) {
            const newCards = drawDeck({jokers: false});

            sAssert(this.ctx.random);
            this.deck.splice(this.deck.length, 0, 
                ...this.ctx.random.Shuffle(newCards)
            );
        }

        const result = this.deck.splice(0, nCards);

        // Can fail if more than the number of cards in a deck was requested.
        sAssert(nCards === result.length); 

        return result;
    }

}