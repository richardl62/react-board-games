import React from "react";
import { sAssert } from "../../../utils/assert";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { displayName, scoreCategories, ScoreCategory } from "../score-categories";
import { ScoreCard } from "../server-side/score-card";

function getScoreCategory(scoreCard: ScoreCard): ScoreCategory {
    let category: ScoreCategory | null = null;
    for (const cat of scoreCategories) {
        if (scoreCard[cat]) {
            sAssert(!category, "More than one category set in score card");
            category = cat;
        }
    }
    sAssert(category);
    return category;
}

interface GridStatusProps {
    checkGridResult: ReturnType<typeof checkGrid>;
}
export function GridStatus(props: GridStatusProps) : JSX.Element {

    const { scoreOptions, connectivity, illegalWords, nBonuses } = props.checkGridResult;

    if (connectivity === "empty") {
        <div>Grid is not connected</div>;
    }

    if (connectivity === "disconnected") {
        return <div>Grid is not connected</div>;
    }

    if (illegalWords) {
        return <div>
            <span>Illegal words:</span>
            {illegalWords.map((word, index) => <span key={index}>{word}</span>)}
        </div>;
    }

    if (!scoreOptions) {
        return <div>Grid does not score</div>;
    }

    const category = getScoreCategory(scoreOptions);

    return <div>
        <span>{displayName[category]}</span>
        {nBonuses && <span>{`${nBonuses} bonus(es)`}</span>}
    </div>;
}
