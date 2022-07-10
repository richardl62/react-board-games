
import { sAssert } from "../../../../utils/assert";
import { bonusScore } from "../../config";
import { ScoreCategory } from "../../score-categories";
import { ScoreCard } from "../../server-side/score-card";
import { ServerData } from "../../server-side/server-data";
import { checkGrid } from "./check-grid";

interface ScoringData extends ReturnType<typeof checkGrid> {
    scoreCard: ScoreCard;
}

export class ScoreOptions {
    private playerScoreOptions: {[pid: string]: ScoringData} = {};

    constructor(
        playerData: ServerData["playerData"],
        isLegalWord: (word: string) => boolean,
    ) {
        for(const pid in playerData) {
            const { scoreCard, gridRackAndScore } = playerData[pid];
            sAssert(gridRackAndScore);


            this.playerScoreOptions[pid] = {
                ... checkGrid(gridRackAndScore.grid, scoreCard, isLegalWord),
                scoreCard
            };
        }
    }

    private scoringData(pid: string) {
        const data = this.playerScoreOptions[pid];
        sAssert(data, "Unrecognised player id");
        return data;
    }

    scoreOption(pid: string, category: ScoreCategory) : number | null {
        const sd = this.scoringData(pid);
        
        if(!sd.scoreCategory) {
            // The grid does not score, so any unused categories can be zeroed.
            return sd.scoreCard[category] === undefined ? 0 : null;
        }

        if(sd.scoreCategory === category) {
            return sd.score;
        }

        return null;
    }

    bonus(pid: string) : number {
        const sd = this.scoringData(pid);

        return sd ? sd.nBonuses * bonusScore : 0;
    }
}
