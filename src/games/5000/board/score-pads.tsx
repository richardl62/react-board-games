import React from "react";
import styled from "styled-components";
import { ScorePad } from "../../../utils/score-pad";
import { useGameContext } from "../client-side/game-context";

const ScorePadsDiv = styled.div`
    display: flex;
    align-items: flex-start;
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
    const { 
        G : { playerScores, heldDice, scoreCarriedOver}, 
        ctx : { currentPlayer },
        getPlayerName 
    } = useGameContext();

    const scorePads = [];
    for (const pid in playerScores) {
        const playerScore = playerScores[pid];
        const active = pid === currentPlayer;
        const score = active ? heldDice.score + scoreCarriedOver : undefined;
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