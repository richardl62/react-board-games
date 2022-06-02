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
}
export function GridStatus(props: GridStatusProps) : JSX.Element | null {

    const { scoreCard, grid } = props;
    const { gridCategory, scoreAs} = findGridCategory(grid, scoreCard, null);
    const { isLegalWord } = useCrossTilesContext();

    let text = "No score";

    if (gridCategory) {
        text = displayName[gridCategory];
        if (scoreAs === "chance") {
            text += " (available as chance)";
        } else if (scoreAs === null) {
            text += " (not available)";
        }

        if (scoreAs) {
            const illegalWords = findIllegalWords(grid, isLegalWord);
            if (illegalWords) {
                text = "Illegal word(s): " + illegalWords.join(" ");
            }
        }
    }

    return <div>{text}</div>;
}
