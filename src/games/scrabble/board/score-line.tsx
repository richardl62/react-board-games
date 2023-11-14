import React from "react";
import { findActiveLetters, getWordsAndScore } from "../client-side";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { blank } from "../config";

export function ScoreLine() : JSX.Element | null {
    const context = useScrabbleContext();

    const active = findActiveLetters(context);
    const wordsAndScore = getWordsAndScore(context, active);
    
    let illegalWords: string[] = [];
    if(wordsAndScore?.illegalWords) {
        illegalWords =  wordsAndScore.illegalWords.filter(word => !word.includes(blank));
    }

    if (active.length === 0) {
        return null;
    }
    
    let scoreText = "Word score: ";
    scoreText += wordsAndScore ? wordsAndScore.score : "-";
    if(illegalWords.length > 0) {
        const pluralise = illegalWords.length > 1 ? "s" : ""; 
        scoreText += ` (includes illegal word${pluralise}: ${illegalWords.join(", ")})`;
    }

    return <div>{scoreText}</div>;
}
