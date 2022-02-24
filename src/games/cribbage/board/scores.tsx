import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../cribbage-context";

const ScoresDiv = styled.div`
    display: flex;    
`;

export function Scores() : JSX.Element {
    const { me, other } = useCribbageContext();
    return <ScoresDiv>
        <PlayerScores name="me" scores={me.scores} />
        <PlayerScores name="other" scores={other.scores} />
    </ScoresDiv>;
}

interface PlayerScoresProps {
    name: string;
    scores: number[];
}

function PlayerScores(props: PlayerScoresProps) {
    const { name, scores } = props;

    const totalScore = scores.reduce((prev, current) => prev + current, 0);
    
    return <div>
        <div>{name}</div>
        <input type="number" placeholder="Enter Score"/>
        <div>
            {scores.map(
                (score, index) => <div key={index}>{score}</div>
            )}
        </div>
        <div>
            <span>Total: </span>
            <span>{totalScore}</span>
        </div>
    </div>;
}
