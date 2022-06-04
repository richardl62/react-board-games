
import { sAssert } from "../../../../utils/assert";
import { bonusScore } from "../../config";
import { FixedScoreCategory, fixedScores, ScoreCategory } from "../../score-categories";
import { ScoreCard } from "../../server-side/score-card";

import { ServerData } from "../../server-side/server-data";
import { countBonusLetters } from "./count-bonus-letters";
import { checkGrid } from "./check-grid";

export interface ScoringData {
    scoreCard: ScoreCard;
    
    // The categery found just from the grid.
    gridCategory: FixedScoreCategory | null;
    scoreAs: "self" | "chance" | false;
    
    bonus: number;
}

export class ScoreOptions {
    private playerScoreOptions: {[pid: string]: ScoringData} = {};

    constructor(
        playerData: ServerData["playerData"],
        isLegalWord: (word: string) => boolean,
    ) {
        for(const pid in playerData) {
            const { scoreCard, grid } = playerData[pid];
            sAssert(grid);

            const {gridCategory, scoreAs} = 
                checkGrid(grid, scoreCard, isLegalWord);
            
            let bonus = 0;
            if(scoreAs) {
                bonus = countBonusLetters(grid) * bonusScore;
            }

            this.playerScoreOptions[pid] = {gridCategory, scoreAs,
                bonus, scoreCard};
        }
    }

    private scoringData(pid: string) {
        const data = this.playerScoreOptions[pid];
        sAssert(data, "Unrecognised player id");
        return data;
    }

    scoreOption(pid: string, category: ScoreCategory) : number | null {
        const pso = this.scoringData(pid);
        if(!pso) {
            return null;
        }

        if(!pso.scoreAs) {
            // The grid does not score, so any unused categories can be zeroed.
            return pso.scoreCard[category] === undefined ? 0 : null;
        }

        if (
            (pso.scoreAs === "self" && category === pso.gridCategory) ||
            (pso.scoreAs === "chance" && category === "chance")
        ) {
            const { gridCategory } = pso;

            // If there is a score there must be a grid category
            sAssert(gridCategory);  

            return fixedScores[gridCategory];
        }

        return null;
    }

    bonus(pid: string) : number {
        const pso = this.scoringData(pid);

        return pso ? pso.bonus : 0;
    }
}
