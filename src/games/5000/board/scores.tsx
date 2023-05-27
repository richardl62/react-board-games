import React from "react";
import { useGameContext } from "../client-side/game-context";

function score(text: string, score: number) {
    return <span>{`${text}: ${score} `}</span>;
}

export function Scores() : JSX.Element {
    const {G: {scoreToBeat, scoreCarriedOver, diceScores}} = useGameContext();

    return <div>
        <div>{scoreToBeat && score("Score to beat", scoreToBeat.value)}</div>

        <div>
            {score("Previous dice score", diceScores.prevRollHeld)}
            {score("Carried over", scoreCarriedOver)} 
            {score("Total", diceScores.prevRollHeld + scoreCarriedOver)}
        </div>
        <div>
            {score("Held dice", diceScores.held)}
            {diceScores.held > 0 && `(${diceScores.heldCategories.join(", ")})`}
        </div>
        <div>
            Non-scoring dice: {diceScores.nonScoringFaces}
        </div>
    </div>;
}