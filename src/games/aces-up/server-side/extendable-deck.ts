import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { deckNoJokers } from "../../../utils/cards/deck";

type Option = "noKings";
export class ExtendingDeck {
    constructor(ctx: Ctx, deck: CardNonJoker[], option?: Option) {
 
        this.ctx = ctx;
        this.deck = deck;
        this.option = option || null;
    }
    ctx: Ctx;
    deck: CardNonJoker[];
    option: Option | null;

    draw() : CardNonJoker {
        let card;
        while (!card) {
            const c = this.deck.pop();
            if (!c) {
                const newCards = deckNoJokers();

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

    drawN(count: number) : CardNonJoker[] {
        const cards = [];
        for(let i = 0; i < count; ++i) {
            cards.push(this.draw());
        }
        return cards;
    }
}
