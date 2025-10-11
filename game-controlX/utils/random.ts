import { RandomAPI } from "../types/random-api.js";


export const random: RandomAPI = {
    Die: (spotvalue) => Math.floor(Math.random() * spotvalue) + 1,

    Shuffle: <T>(deck: T[]) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    },
};
