import { assertThrow as sAssert } from '@shared/utils/assert';

// Colors suggest by Gemini based on my originals of blue, red, green and orange;
// The idea is to get better contrast with the white text.
const playerColors = [
    "blue",    // Player 0
    "#CC0000", // Player 1 (dark red)
    "#006400", // Player 2 (dark green)
    "#D2691E", // Player 3 (chocolate/dark orange)
];

export const colors = {
    board: {
        background: "cornsilk",
        border: "darkred", // Includes internal boarders
    },
    
    temporaryOwner: "grey",

    // Text color for buttons whoses foreground is a player colour.
    playerButtonText: "white",

    dice: "darkred",
};

export function playerColor(playerID: string) {
    const player = parseInt(playerID, 10);
    sAssert(player >= 0 && player < playerColors.length, `Invalid player number: ${player}`);
    return playerColors[player];
}

export const subSquare = {
    width: "18px",
    height: "40px",
    border: "none", //`${colors.board.border} solid 1px`,
};

