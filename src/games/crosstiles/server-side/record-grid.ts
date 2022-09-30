import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Letter } from "../config";
import { makeEmptyGrid } from "./make-empty-grid";
import { ServerData, GameStage } from "./server-data";
import { ScoreWithCategory } from "./set-score";

export function recordGrid(
    G: ServerData,
    ctx: Ctx,
    gridAndScore: {
        grid: (Letter | null)[][],
        rack:  (Letter | null)[],
        score: ScoreWithCategory | null,
    }
): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to recordGrid - " + G.stage);
    }

    const { playerID } = ctx;
    sAssert(playerID);

    const {grid, rack, score} = gridAndScore;

    G.playerData[playerID].gridRackAndScore = {
        grid: grid.map(row => [...row]),
        rack: [...rack],
        score
    };
}

export function recordEmptyGrid(
    G: ServerData,
    ctx: Ctx,
): void {

    const { playerID } = ctx;
    sAssert(playerID);

    const { selectedLetters } = G.playerData[playerID];
    sAssert(selectedLetters);

    recordGrid(
        G, ctx,
        {
            grid: makeEmptyGrid(),
            rack: selectedLetters,
            score: null,
        }
    );

}