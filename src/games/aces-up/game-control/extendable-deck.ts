import { CardNonJoker } from "../../../utils/cards";
import { deckNoJokers } from "../../../utils/cards/deck";
import { RandomAPI } from "../../../boardgame-lib/random";

type Filter = (c: CardNonJoker) => boolean;
export class ExtendingDeck {
    constructor(random: RandomAPI, deck: CardNonJoker[]) {
 
        this.random = random;
        this.deck = deck;
    }
    random: RandomAPI;
    deck: CardNonJoker[];

    // If a filter is supplied only cards for which filter returns true
    // will be returned.
    draw(filter?: Filter) : CardNonJoker {
        let card;
        while (!card) {
            const c = this.deck.pop();
            if (!c) {
                // Draw a new deck
                const newCards = deckNoJokers();

                this.deck.splice(this.deck.length, 0,
                    ...this.random.Shuffle(newCards)
                );
            } else if(!filter || filter(c)) {
                card = c;
            }
        }

        return card;
    }

    // See draw for commint on filter.
    drawN(count: number, filter?: Filter) : CardNonJoker[] {
        const cards = [];
        for(let i = 0; i < count; ++i) {
            cards.push(this.draw(filter));
        }
        return cards;
    }
}
