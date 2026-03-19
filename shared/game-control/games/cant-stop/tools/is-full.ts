import { PlayerID } from "../../../../../shared/game-control/playerid.js";
import { ColumnHeight, ServerData } from "../server-data.js";

export function isFull(
    col: number,
    category: keyof ColumnHeight,
    heights: ServerData["columnHeights"]
) : PlayerID | undefined {
    for (const [playerID, playerHeights] of Object.entries(heights)) {
        if (playerHeights[col][category] === "full") {
            return playerID;
        }
    }

    return undefined;
}