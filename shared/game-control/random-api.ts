// See https://boardgame.io/documentation/#/random for a discussion 
// of randomnness in these sorts games. 

// This interface is based on RandomAPI used in boardgame.io.
export class RandomAPI {
    private draw: () => number;

    constructor(drawFunction: () => number) {
        this.draw = drawFunction;
    }
    
    /** Pick an integer in range [1, spotValue] */
    Die(spotvalue: number): number {
         return Math.floor(this.draw() * spotvalue) + 1
    }

    // Shuffle the deck in place, and return the deck deck.
    Shuffle<T>(deck: T[]): T[] {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(this.draw() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
}

export function seededDraw(seed: number) : () => number {
    // Based on https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
    if (seed < 0 || seed >= 1) { 
        throw new Error("Seed must be in range [0, 1).");
    }

    const big = 0x100000000;
    let t = seed * big;
    return function next() {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / big; // [0,1)
    };
}