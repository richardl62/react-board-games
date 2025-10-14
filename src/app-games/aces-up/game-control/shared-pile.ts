import { sAssert } from "../../../utils/assert";
import { CardNonJoker, Rank, nextRank } from "../../../utils/cards/types";
import { GameOptions, OptionWrapper } from "../game-support/game-options";

export interface SharedPileData {
    old: CardNonJoker[];
    thisTurnStandard: CardNonJoker[];
        
    /** Jacks and Queens with 'Jacks and Queens' option */
    recentSpecial: CardNonJoker[];
}

export function makeSharedPileData(cards: CardNonJoker[] = []) : SharedPileData {
    return {
        old: cards,
        thisTurnStandard: [],

        /** Jacks and Queens with 'Jacks and Queens' option.
         *  They have had there effect (to clear or steal)
         *  but are keep for display purposes.
         */
        recentSpecial: [],
    };
} 

export class SharedPile {
    private _old: CardNonJoker[];
    private _thisTurnStandard: CardNonJoker[];
    private _recentSpecials: CardNonJoker[];
    private _options: GameOptions;
    
    constructor(data: SharedPileData, options: GameOptions) {
        this._old = data.old;
        this._thisTurnStandard = data.thisTurnStandard;
        this._recentSpecials = data.recentSpecial;
        this._options = options;
    }

    // Intended for limited use only
    get data(): SharedPileData {
        return {
            old: this._old,
            thisTurnStandard: this._thisTurnStandard,
            recentSpecial: this._recentSpecials,
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
        
        const cards = [...this._old, ...this._thisTurnStandard];
        return getRank(cards);
    }

    tops() : {
        old: CardNonJoker | undefined,
        thisTurnStandard: CardNonJoker | undefined,
        thisTurnSpecials: CardNonJoker | undefined,    
        } {
        return {
            old: this._old.at(-1),
            thisTurnStandard: this._thisTurnStandard.at(-1),
            thisTurnSpecials: this._recentSpecials.at(-1),
        };
    }

    /** Return the top card, or undefined if there are no cards. */
    get top() : CardNonJoker | undefined {
        return this._thisTurnStandard.at(-1) || this._old.at(-1);
    }

    get isEmpty() : boolean {
        return this.top === undefined;
    }

    get isFull() : boolean {
        const rank = this.rank;
        return rank === this._options.topRank;
    }               

    clear(killerCard: CardNonJoker) {
        sAssert(killerCard.rank === this._options.killerRank);

        //make this._old empty
        this._old.splice(0);
        this._thisTurnStandard.splice(0);

        this._recentSpecials.push(killerCard);
    }

    stealTopCard(thiefCard: CardNonJoker) : CardNonJoker {
        sAssert(thiefCard.rank === this._options.thiefRank);

        const stolen = this._thisTurnStandard.pop() ||
            this._old.pop()!;
        sAssert(stolen, "SharedPile.stealTopCard: no card to steal");

        this._recentSpecials.push(thiefCard);

        return stolen;
    }

    /** Add card played this round */
    addStandardCard(card: CardNonJoker) {
        const optionsWrapper = new OptionWrapper(this._options);
        sAssert(card.rank === "K" || !optionsWrapper.isSpecial(card),
            "SharedPile.add: special card not allowed");
        this._recentSpecials.splice(0);
        this._thisTurnStandard.push(card);
    }

    resetForStartOfRound() {
        this._old.push(...this._thisTurnStandard);
        this._thisTurnStandard.splice(0);
        this._recentSpecials.splice(0);
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




