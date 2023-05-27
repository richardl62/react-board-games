import React from "react";
import styled from "styled-components";
import { ScorePad } from "../../../utils/score-pad";
import { useGameContext } from "../client-side/game-context";

const ScorePadsDiv = styled.div`
    display: block;
    background-color: #333;
    /* Set min width of the individual ScorePads */
    > * {
        min-width: 10em;
    }
    /* Set gap between children */
    > * + * {
        margin-left: 1em;
    }
`;

export function ScorePads() : JSX.Element {
    const { playerID, G : { playerScores, diceScores, scoreCarriedOver}, getPlayerName } = useGameContext();

    const scorePads = [];
    for (const pid in playerScores) {
        const playerScore = playerScores[pid];
        const active = pid === playerID;
        const score = active ? diceScores.held + scoreCarriedOver : undefined;
        scorePads.push(<ScorePad
            key={pid}
            name={getPlayerName(pid)}
            active={active}
            previousScores={playerScore}
            score={score}
        />);
    }

    return <ScorePadsDiv> {scorePads} </ScorePadsDiv>;
}