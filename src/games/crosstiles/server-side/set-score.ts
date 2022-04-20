import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { ServerData, GameStage, ScoreCategory } from "./server-data";
import { startNextStage } from "./start-next-stage";

function nextPlayer(ctx: Ctx, currentPlayer: string) {
    const index = ctx.playOrder.indexOf(currentPlayer);
    sAssert(index >= 0);

    if(index === ctx.playOrder.length -1) {
        return null;
    }

    return ctx.playOrder[index+1];
}

interface setScoreArg {
    category: ScoreCategory;
    score: number;
}
export function setScore(G: ServerData, ctx: Ctx, arg: setScoreArg): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to recordGrid");
    }
    sAssert(G.playerToScore);

    const { playerID } = ctx;
    sAssert(playerID);

    const { category, score } = arg;

    G.playerData[playerID].scoreCard[category] = score;

    G.playerToScore = nextPlayer(ctx, G.playerToScore);

    if(!G.playerToScore) {
        startNextStage(G, ctx);
    }
}