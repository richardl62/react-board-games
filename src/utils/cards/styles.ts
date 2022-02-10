// KLUDGE: Hard code size and width.
// The aspect ratio (1.4) matches the default for the SVGs.
// Doubtless the hardcoding of the aspect ratio could be avoided if I knew

import { CardBack } from "./types";

// more about styling SVGs.
export const cardSize = {
    width: "140px",
    height: "196px", // width * 1.4.
};

export const defaultCardBack : CardBack = "red";
