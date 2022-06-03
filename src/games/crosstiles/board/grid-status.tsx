import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { findIllegalWords } from "../client-side/check-grid/find-illegal-words";
import { findGridCategory } from "../client-side/check-grid/find-grid-category";
import { Letter } from "../config";
import { displayName } from "../score-categories";
import { ScoreCard } from "../server-side/score-card";



interface GridStatusProps {
    scoreCard: ScoreCard, 
    grid: (Letter | null)[][],
    requestConfirmation?: boolean;
}
export function GridStatus(props: GridStatusProps) : JSX.Element | null {

    const { scoreCard, grid, requestConfirmation } = props;
    const { gridCategory, scoreAs} = findGridCategory(grid, scoreCard, null);
    const { isLegalWord } = useCrossTilesContext();

    let text = "No score";
    let scoreAvailable = Boolean(gridCategory);
    if (gridCategory) {
        text = displayName[gridCategory];
        if (scoreAs === "chance") {
            text += " (available as chance)";
        } else if (scoreAs === null) {
            text += " (not available)";
            scoreAvailable = false;
        }

        if (scoreAs) {
            const illegalWords = findIllegalWords(grid, isLegalWord);
            if (illegalWords) {
                text = "Illegal word(s): " + illegalWords.join(" ");
                scoreAvailable = false;
            }
        }
    }

    const confirmation = scoreAvailable ?
        "Player must confirm score" :
        "Player must chose category to zero";

    return <div>
        <div>{text}</div>
        {requestConfirmation && <div>{confirmation}</div>}
    </div>;
}
