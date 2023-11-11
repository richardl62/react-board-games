import React from "react";
import { findActiveLetters, getWordsAndScore } from "../client-side";
import { useScrabbleContext } from "../client-side/scrabble-context";

export function ScoreLine() : JSX.Element | null {
    const context = useScrabbleContext();

    const active = findActiveLetters(context);
    const wordsAndScore = getWordsAndScore(context, active);

    if (active.length === 0) {
        return null;
    }
    
    let scoreText = "Word score: ";
    scoreText += wordsAndScore ? wordsAndScore.score : "-";
    if(wordsAndScore?.illegalWords) {
        scoreText += " (includes illegal word)";
    }

    return <div>{scoreText}</div>;
}