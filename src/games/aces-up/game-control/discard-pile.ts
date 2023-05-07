import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards/types";
import { GameOptions } from "../game-support/game-options";

export interface DiscardPileData {
    cards: CardNonJoker[];
}

export function makeDiscardPileData(cards: CardNonJoker [] = []) : DiscardPileData {
    return {
        cards,
    };
} 

export class DiscardPile {
    private _cards: CardNonJoker[];
    private _options: GameOptions;
    
    constructor(data: DiscardPileData, options: GameOptions) {
        this._cards = data.cards;
        this._options = options;
    }

    get length() : number {
        return this._cards.length;
    }

    get cards() : CardNonJoker[] {
        return this._cards;
    }

    get isEmpty() : boolean {
        return this.cards.length === 0;
    }

    get topCard() : CardNonJoker | undefined {
        return this._cards.at(-1);
    }
            
    clear(killerCard: CardNonJoker) {
        sAssert(killerCard.rank === this._options.killerRank);

        this._cards.splice(0);
    }

    stealTopCard(thiefCard: CardNonJoker) : CardNonJoker {
        sAssert(thiefCard.rank === this._options.thiefRank);

        const stolen = this._cards.pop();
        sAssert(stolen, "SharedPile.stealTopCard: no card to steal");

        return stolen;
    }

    add(...cards: CardNonJoker[]) {
        this._cards.push(...cards);
    }

    removeFromTop(count: number) : CardNonJoker[] {
        const removed = this._cards.splice(
            this._cards.length - count,
            count);
        sAssert(removed.length === count,
            "DiscardPile.removeFromTop: not enough cards");
        return removed;
    }
}