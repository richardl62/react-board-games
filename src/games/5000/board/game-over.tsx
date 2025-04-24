import { JSX } from "react";
import { useGameContext } from "../client-side/game-context";
import styled from "styled-components";

const Header = styled.div`
    font-family: Arial;
    font-size: 16px;

    font-weight: bold;
`;

const Name = Header; // KLUDGE?

const Score = styled.div`
    font-family: "Arial";
    font-size: 16px;
`;

const ScoreTable = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 6px;

    font-family: Arial;
    font-size: 16px;

    margin-left: 1em;
`;

export function GameOver() : JSX.Element {
    const {
        G: {playerScores},
        getPlayerName,
    } = useGameContext();

    const scores = Object.entries(playerScores).map(([playerID, scores]) => {
        return {
            name: getPlayerName(playerID),
            score: scores.reduce((sum, score) => sum + score, 0)
        };
    });

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    return <div>
        <Header>Final Scores:</Header>
        <ScoreTable>
            {scores.map(({ name, score }) => [
                <Name key={name}> {name} </Name>,
                <Score key={"!" + name}> {score} </Score>
            ])}
        </ScoreTable>
    </div>;
}