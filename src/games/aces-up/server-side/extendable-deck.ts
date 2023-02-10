import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { deck as drawDeck } from "../../../utils/cards/deck";

type Option = "noKings";
export class ExtendingDeck {
    constructor(ctx: Ctx, deck: Card[], option?: Option) {
 
        this.ctx = ctx;
        this.deck = deck;
        this.option = option || null;
    }
    ctx: Ctx;
    deck: Card[];
    option: Option | null;

    draw() : Card {
        let card;
        while (!card) {
            const c = this.deck.pop();
            if (!c) {
                const newCards = drawDeck({ jokers: false });

                sAssert(this.ctx.random);
                this.deck.splice(this.deck.length, 0,
                    ...this.ctx.random.Shuffle(newCards)
                );
            } else if(c.rank !== "K" || this.option !== "noKings") {
                card = c;
            }
        }

        return card;
    }

    drawN(count: number) : Card[] {
        const cards = [];
        for(let i = 0; i < count; ++i) {
            cards.push(this.draw());
        }
        return cards;
    }
}