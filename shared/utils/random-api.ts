// See https://boardgame.io/documentation/#/random for a discussion
// of randomnness in these sorts games.

// This interface is based on RandomAPI used in boardgame.io.
export class RandomAPI {
    private t: number;

    private constructor(t: number) {
        this.t = t;
    }

    static fromSeed(seed: number): RandomAPI {
        if (seed < 0 || seed >= 1) {
            throw new Error("Seed must be in range [0, 1).");
        }
        return new RandomAPI(seed * 0x100000000);
    }

    static fromState(state: number): RandomAPI {
        return new RandomAPI(state);
    }

    // Returns the internal PRNG state, suitable for passing to fromState() later.
    getState(): number {
        return this.t;
    }

    private next(): number {
        // Based on https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
        this.t += 0x6D2B79F5;
        let r = Math.imul(this.t ^ (this.t >>> 15), this.t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 0x100000000; // [0,1)
    }

    /** Pick an integer in range [1, spotValue] */
    Die(spotvalue: number): number {
        return Math.floor(this.next() * spotvalue) + 1;
    }

    // Shuffle the deck in place, and return the deck.
    Shuffle<T>(deck: T[]): T[] {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
}
