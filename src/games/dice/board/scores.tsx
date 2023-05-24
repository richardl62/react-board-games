import React from "react";
import { useGameContext } from "../client-side/game-context";
import { getScores } from "../utils/get-scores";
import { scoringCategoryNames, totalScore } from "../utils/dice-score";

function score(text: string, score: number) {
    return <span>{`${text}: ${score} `}</span>;
}

export function Scores() : JSX.Element {
    const {G: {faces, held, scoreToBeat, 
        scoreThisTurn: {current, carriedOver: heldOver}, 
    }} = useGameContext();

    const heldFaces = faces.filter((_, index) => held[index]);
    const heldScores = getScores(heldFaces);

    const totalHeld = totalScore(heldScores);
    const categoryNames = scoringCategoryNames(heldScores).join(", ");

    return <div>
        <div>{score("Score to beat", scoreToBeat)}</div>

        <div>
            {score("Previous dice score", current)}
            {score("Carried over", heldOver)} 
            {score("Total", current + heldOver)}
        </div>
        <div>
            {score("Held dice", totalHeld)}
            {totalHeld > 0 && `(${categoryNames})`}

        </div>
    </div>;
}