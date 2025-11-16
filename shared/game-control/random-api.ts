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

// Create a seeded draw function using a simple algorithm.
// (Code written by Copilot.)
export function seededDraw(seed: number): () => number {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;

    return function() {
        value = (value * 48271) % 2147483647;
        return (value - 1) / 2147483646;
    }
}