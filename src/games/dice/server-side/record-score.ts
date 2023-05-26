import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { ServerData } from "./server-data";

export function recordScore (
    { G }: MoveArg0<ServerData>,
    { playerID, score}: {playerID: string, score: number},
): void {
    G.playerScores[playerID].push(score);
}