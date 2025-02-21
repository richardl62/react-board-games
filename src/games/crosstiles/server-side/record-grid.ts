import { sAssert } from "../../../utils/assert";
import { Letter } from "../config";
import { makeEmptyGrid } from "./make-empty-grid";
import { ServerData, GameStage } from "./server-data";
import { ScoreWithCategory } from "./set-score";
import { MoveArg0 } from "../../../boardgame-lib/game";
import { PlayerID } from "../../../boardgame-lib/playerid";

interface GridAndScore {
    grid: (Letter | null)[][],
    rack:  (Letter | null)[],
    score: ScoreWithCategory | null, 
}

export function doRecordGrid(
    G :ServerData,
    playerID: PlayerID,
    gridAndScore: GridAndScore,
): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to recordGrid - " + G.stage);
    }

    const {grid, rack, score} = gridAndScore;

    G.playerData[playerID].gridRackAndScore = {
        grid: grid.map(row => [...row]),
        rack: [...rack],
        score
    };
}

export function recordGrid(
    { G, playerID } : MoveArg0<ServerData>,
    gridAndScore: GridAndScore,
): void {
    doRecordGrid(G, playerID, gridAndScore);
}

export function recordEmptyGrid(
    G: ServerData,
    playerID: PlayerID,
): void {
    const { selectedLetters } = G.playerData[playerID];
    sAssert(selectedLetters);

    doRecordGrid(
        G,
        playerID,
        {
            grid: makeEmptyGrid(),
            rack: selectedLetters,
            score: null,
        }
    );

}
