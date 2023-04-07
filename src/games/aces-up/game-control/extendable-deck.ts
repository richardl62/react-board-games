import { CardNonJoker } from "../../../utils/cards";
import { deckNoJokers } from "../../../utils/cards/deck";
import { RandomAPI } from "boardgame.io/dist/types/src/plugins/random/random";

type Option = "noKings";
export class ExtendingDeck {
    constructor(random: RandomAPI, deck: CardNonJoker[]) {
 
        this.random = random;
        this.deck = deck;
    }
    random: RandomAPI;
    deck: CardNonJoker[];

    draw(option?: Option) : CardNonJoker {
        let card;
        while (!card) {
            const c = this.deck.pop();
            if (!c) {
                // Draw a new deck
                const newCards = deckNoJokers();

                this.deck.splice(this.deck.length, 0,
                    ...this.random.Shuffle(newCards)
                );
            } else if(c.rank !== "K" || option !== "noKings") {
                card = c;
            }
        }

        return card;
    }

    drawN(count: number, option?: Option) : CardNonJoker[] {
        const cards = [];
        for(let i = 0; i < count; ++i) {
            cards.push(this.draw(option));
        }
        return cards;
    }
}
