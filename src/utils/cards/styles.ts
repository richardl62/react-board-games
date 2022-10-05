// KLUDGE: Hard code size and width.
// The aspect ratio (1.4) matches the default for the SVGs.
// Doubtless the hardcoding of the aspect ratio could be avoided if I knew

import { CardBack } from "./types";

const cardHieght = 140;

// Card size in pixels
export const cardSize = { 
    height: cardHieght,
    width: cardHieght / 1.4, 
};

export const defaultCardBack : CardBack = "red";
