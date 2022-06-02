import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { findIllegalWords } from "../client-side/check-grid/find-illegal-words";
import { findScoreOption } from "../client-side/check-grid/score-options";
import { Letter } from "../config";
import { displayName } from "../score-categories";
import { ScoreCard } from "../server-side/score-card";



interface GridStatusProps {
    scoreCard: ScoreCard, 
    grid: (Letter | null)[][],
}
export function GridStatus(props: GridStatusProps) : JSX.Element | null {

    const { scoreCard, grid } = props;
    const { gridCategory, scoringCategory} = findScoreOption(grid, scoreCard);
    const { isLegalWord } = useCrossTilesContext();

    if (!gridCategory) {
        return null;
    }

    let mainText = displayName[gridCategory];
    if (scoringCategory === "chance") {
        mainText += " (available as chance)";
    } else if (scoringCategory === null) {
        mainText += " (not available)";
    }

    const illegalWords = findIllegalWords(grid, isLegalWord);

    return <div>
        <div>{mainText}</div>
        {illegalWords && <div>
            {"Illegal word(s): " + illegalWords.join(" ")}
        </div>}
    </div>;
}
