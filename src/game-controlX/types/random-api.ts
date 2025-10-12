export interface RandomAPI {
    /** Pick an integer in range [1, spotValue] */
    Die(spotvalue: number): number;

    // Shuffle the deck in place, and return the deck deck.
    Shuffle<T>(deck: T[]): T[];
}

