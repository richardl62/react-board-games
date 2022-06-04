import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { bonusScore, Letter } from "../config";
import { displayName, ScoreCategory } from "../score-categories";
import { ScoreCard } from "../server-side/score-card";
import { countBonusLetters } from "../client-side/check-grid/count-bonus-letters";
import { sAssert } from "../../../utils/assert";



interface GridStatusProps {
    scoreCard: ScoreCard, 
    grid: (Letter | null)[][],
}
export function GridStatus(props: GridStatusProps) : JSX.Element | null {

    const { scoreCard, grid } = props;
    const { isLegalWord } = useCrossTilesContext();

    const { gridCategory, scoreAs, illegalWords, nBonuses} = 
        checkGrid(grid, scoreCard, isLegalWord);

    let text;

    if(scoreAs) {
        sAssert(gridCategory);
        text = displayName[gridCategory];
        if(scoreAs === "chance") {
            text += " (as chance)";
        }

        if (nBonuses === 1) {
            text += " & bonus";
        }

        if (nBonuses > 1) {
            text += ` + ${nBonuses} bonuses`;
        }
    } else {
        text = "No score";
        if (illegalWords) {
            text += ` (Illegal words: ${illegalWords.join(" ")})`;
        } else if ( gridCategory) {
            text += ` (${displayName[gridCategory]} unavailable)`;
        } 
    }

    return <div>{text}</div>;
}

interface ConfirmedScoreProps {
    scoreCard: ScoreCard;
    grid: (Letter | null)[][];
    chosenCategory: ScoreCategory;
}

export function ConfirmedScore(props: ConfirmedScoreProps) : JSX.Element {
    const {scoreCard, grid, chosenCategory} = props;
    const categoryName = displayName[chosenCategory];
    const score = scoreCard[chosenCategory];

    let text = `${score} points for ${categoryName}`;
    if(score === 0) {
        const bonus = countBonusLetters(grid) * bonusScore;
        if(bonus > 0) {
            text += `and ${bonus} bonus`;
        }
    }
        
    return <div>{text}</div>;
}