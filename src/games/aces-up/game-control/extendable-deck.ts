import { CardNonJoker } from "../../../utils/cards";
import { deckNoJokers } from "../../../utils/cards/deck";

type Shuffle = (arr: CardNonJoker[]) => CardNonJoker[];
type Option = "noKings";
export class ExtendingDeck {
    constructor(deck: CardNonJoker[]) {
 
        this.deck = deck;
    }
    deck: CardNonJoker[];

    draw(shuffle: Shuffle, option?: Option) : CardNonJoker {
        let card;
        while (!card) {
            const c = this.deck.pop();
            if (!c) {
                // Draw a new deck
                const newCards = deckNoJokers();

                this.deck.splice(this.deck.length, 0, ...shuffle(newCards));
            } else if(c.rank !== "K" || option !== "noKings") {
                card = c;
            }
        }

        return card;
    }

    drawN(count: number, shuffle: Shuffle, option?: Option) : CardNonJoker[] {
        const cards = [];
        for(let i = 0; i < count; ++i) {
            cards.push(this.draw(shuffle, option));
        }
        return cards;
    }
}
