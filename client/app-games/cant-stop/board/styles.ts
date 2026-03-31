import { assertThrow as sAssert } from '@shared/utils/assert';


export const colors = {
    players: [
        "#FF0000", // Vibrant Red
        "#228B22", // Forest Green
        "blue",
        "#E67E22", // Vibrant Orange
    ],
    
    board: {
        background: "cornsilk",
        border: "#4A0000", // Deep Maroon
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
