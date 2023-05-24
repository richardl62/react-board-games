import React from "react";
import { useGameContext } from "../client-side/game-context";
import { ShowWithCategories } from "./scores-with-catagories";

function score(text: string, score: number) {
    return <span>{`${text}: ${score} `}</span>;
}

export function Scores() : JSX.Element {
    const {G: {faces, held, scoreToBeat, 
        scoreThisTurn: {dice, heldOver}, 
    }} = useGameContext();

    return <div>
        <div>{score("Score to beat", scoreToBeat)}</div>

        <div>
            {score("Dice this turn", dice)}
            {score("Previous", heldOver)}
            {score("total", dice+heldOver)}
        </div>
        <ShowWithCategories faces={faces} held={held} />
    </div>;
}