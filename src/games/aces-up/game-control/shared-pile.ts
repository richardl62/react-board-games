import { CardNonJoker, Rank, nextRank } from "../../../utils/cards/types";
import { GameOptions } from "../game-support/game-options";

export interface SharedPileData {
    oldCards: CardNonJoker[];
    cardsAddedThisRound: CardNonJoker[];
}

export function makeSharedPileData(cards: CardNonJoker[] = []) : SharedPileData {
    return {
        oldCards: cards,
        cardsAddedThisRound: [],
    };
} 

export class SharedPile {
    private _oldCards: CardNonJoker[];
    private _cardsAddedThisRound: CardNonJoker[];
    private _options: GameOptions;
    
    constructor(data: SharedPileData, options: GameOptions) {
        this._oldCards = data.oldCards;
        this._cardsAddedThisRound = data.cardsAddedThisRound;
        this._options = options;
    }

    // Intended for limited use only
    get data(): SharedPileData {
        return {
            oldCards: this._oldCards,
            cardsAddedThisRound: this._cardsAddedThisRound,
        };
    }

    /** Return the effective rank of the top card in the pile,
     * or null if the pile is empty. 
     * The effective rank takes account of Kings. For example if the
     * actual ranks are ... 3, K, K the effective rank is 5.
     */
    get rank(): Rank | null {

        function getRank(cards: CardNonJoker[]): Rank | null {
            if(cards.length === 0) {
                return null;
            }
        
            const top = cards.at(-1)!;
            if(top.rank !== "K") {
                return top.rank;
            }
        
            const topRemoved = cards.slice(0,-1);
            return nextRank(getRank(topRemoved))!;
        }
        
        const cards = [...this._oldCards, ...this._cardsAddedThisRound];
        return getRank(cards);
    }

    get topLastTurn() : CardNonJoker | undefined {
        return this._oldCards.at(-1);
    }

    get topThisTurn() : CardNonJoker | undefined {
        return this._cardsAddedThisRound.at(-1);
    }

    /** Return the top card, or undefined if there are no cards. */
    get top() : CardNonJoker | undefined {
        return this.topThisTurn || this.topLastTurn;
    }

    get isEmpty() : boolean {
        return this.top === undefined;
    }

    get isFull() : boolean {
        const rank = this.rank;
        return rank === this._options.topRank;
    }               

    removeTopCard() : CardNonJoker | undefined {
        if(this._cardsAddedThisRound.length > 0) {
            return this._cardsAddedThisRound.pop();
        }

        return this._oldCards.pop();
    }

    /** Add card played this round */
    add(card: CardNonJoker) {
        return this._cardsAddedThisRound.push(card);
    }

    resetForStartOfRound() {
        this._oldCards.push(...this._cardsAddedThisRound);
        this._cardsAddedThisRound = [];
    }
}

// Intended for use with ServerData. But it is not explicitly use
// to avoid a circular dependency.
export function makeSharedPiles({sharedPileData, options} :
    {sharedPileData: SharedPileData[], options: GameOptions}
) : SharedPile [] {
    return sharedPileData.map(
        (data) => new SharedPile(data, options)
    );  
}




