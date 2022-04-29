import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { totalScore } from "../server-side/score-card";
import { GameStage } from "../server-side/server-data";

const Heading = styled.div`
    font-weight: bold;
`;

const ScoreTable = styled.div`
    display: inline-grid;
    column-gap: 0.5em;
    grid-template-columns: auto auto
`;

export function GameOver() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData,  wrappedGameProps } = context;
    const { getPlayerName } = wrappedGameProps;

    if(stage !== GameStage.gameOver) {
        return null;
    }

    const scores = [];
    for(const pid in playerData) {
        const name = getPlayerName(pid);
        const score = totalScore(playerData[pid].scoreCard);
        scores.push({name,score});
    }
    
    // Highest score first
    scores.sort((p1, p2) => p2.score - p1.score);


    return <div>
        <Heading>Final scores</Heading>

        <ScoreTable>
            {scores.map(ps => [
                <div key={ps.name}>{ps.name}</div>,
                <div key={ps.name+"score"}>{ps.score}</div>
            ]
            )}
        </ScoreTable>
    </div>;
}