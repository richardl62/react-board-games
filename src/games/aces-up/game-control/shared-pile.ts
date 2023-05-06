import { CardNonJoker, Rank, nextRank } from "../../../utils/cards/types";
import { GameOptions } from "../game-support/game-options";

export interface SharedPileData {
    oldCards: CardNonJoker[];
    cardsPushedThisRound: CardNonJoker[];
}

export function makeSharedPileData(cards: CardNonJoker[] = []) : SharedPileData {
    return {
        oldCards: cards,
        cardsPushedThisRound: [],
    };
} 

export class SharedPile {
    private _oldCards: CardNonJoker[];
    private _cardsPushedThisRound: CardNonJoker[];
    private _options: GameOptions;
    
    constructor(data: SharedPileData, options: GameOptions) {
        this._oldCards = data.oldCards;
        this._cardsPushedThisRound = data.cardsPushedThisRound;
        this._options = options;
    }

    get cardsPushedThisRound() : CardNonJoker[] { // TEMPORARY
        return this._cardsPushedThisRound;
    }

    // Intended for limited use only
    get data(): SharedPileData {
        return {
            oldCards: this._oldCards,
            cardsPushedThisRound: this._cardsPushedThisRound,
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
        
        const cards = [...this._oldCards, ...this._cardsPushedThisRound];
        return getRank(cards);
    }

    get topLastTerm() : CardNonJoker | undefined {
        return this._oldCards.at(-1);
    }

    get topThisTerm() : CardNonJoker | undefined {
        return this._cardsPushedThisRound.at(-1);
    }

    /** Return the top card, or undefined if there are no cards. */
    get top() : CardNonJoker | undefined {
        return this.topThisTerm || this.topLastTerm;
    }

    removeTopCard() : CardNonJoker | undefined {
        if(this._cardsPushedThisRound.length > 0) {
            return this._cardsPushedThisRound.pop();
        }

        return this._oldCards.pop();
    }

    resetForStartOfRound() {
        this._oldCards.push(...this._cardsPushedThisRound);
        this._cardsPushedThisRound = [];
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




