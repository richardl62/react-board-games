import React from "react";
import styled from "styled-components";
import { ScorePad } from "../../../utils/score-pad";
import { useGameContext } from "../client-side/game-context";

const ScorePadsDiv = styled.div`
    display: block;
    /* Set min width of the individual ScorePads */
    > * {
        min-width: 10em;
    }
    /* Set gap between children */
    > * + * {
        margin-left: 1em;
    }
`;
// Some ScorePad samples
export function ScorePads() : JSX.Element {
    const { playerID, G : { playerScores}, getPlayerName } = useGameContext();

    const scorePads = [];
    for (const pid in playerScores) {
        const playerScore = playerScores[pid];
        scorePads.push(<ScorePad
            key={pid}
            name={getPlayerName(pid)}
            active={pid === playerID}
            previousScores={playerScore}
        />);
    }

    return <ScorePadsDiv> {scorePads} </ScorePadsDiv>;
}