import { assertThrow as sAssert } from '@shared/utils/assert';


export const colors = {
    players: [
        "blue",    // Player 0
        "#CC0000", // Player 1 (dark red)
        "#006400", // Player 2 (dark green)
        "#D2691E", // Player 3 (chocolate/dark orange)
    ],
    
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
    sAssert(player >= 0 && player < colors.players.length, `Invalid player number: ${player}`);
    return colors.players[player];
}

export const subSquare = {
    width: "18px",
    height: "40px",
};

// Used for borders of columns and squares.
export const squareBorder = `3px solid ${colors.board.border}`;

