// See https://boardgame.io/documentation/#/random for a discussion 
// of randomnness in these sorts games. 

// This interface is based on RandomAPI used in boardgame.io.
export interface RandomAPI {
    /** Pick an integer in range [1, spotValue] */
    Die(spotvalue: number): number;

    // Shuffle the deck in place, and return the deck deck.
    Shuffle<T>(deck: T[]): T[];
}

// WARNING: Not suitable for use in React components because it 
// is not deterministic. 
export const serverRandomAPI: RandomAPI = {
    Die: (spotvalue) => Math.floor(Math.random() * spotvalue) + 1,

    Shuffle: <T>(deck: T[]) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    },
};
