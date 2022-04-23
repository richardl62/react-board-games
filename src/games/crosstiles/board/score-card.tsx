import React from "react";
import styled from "styled-components";
import { displayName, scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { scoreCardBackgroundColor, scoreCardBoardColor } from "./style";
import { sAssert } from "../../../utils/assert";

import { ScoreCard as ScoreCardType } from "../server-side/score-categories";
import { totalScore } from "../client-side/check-grid/total-score";

const ScoreCardDiv = styled.div`
    display: grid;
    grid-template-columns: auto 2em;
    
    background-color: ${scoreCardBoardColor};

    grid-gap: 2px;
    padding 3px;
`;

const Name = styled.div`
    background-color: ${scoreCardBoardColor}; 
    color: white;
    font-weight: bold;

    justify-self: center;
    grid-column: 1 / span 2;
`;

const Se = styled.div` // Se -> Scorecard Element
    background-color: ${scoreCardBackgroundColor};
    padding: 2px;
`;

interface ScoreCardProps {
    name: string;
    scoreCard: ScoreCardType;
    scoreOptions?: ScoreCardType; 
}

export function ScoreCard(props: ScoreCardProps) : JSX.Element {
    const { name, scoreCard, scoreOptions } = props;
    const { playerToScore, wrappedGameProps: {moves, playerID} } = useCrossTilesContext();
    
    const scoreElement = (category: ScoreCategory) => {
        
        if(scoreCard[category] !== undefined) {
            return scoreCard[category];
        }

        if(scoreOptions && scoreOptions[category] !== undefined) {
            const score = scoreOptions[category];
            sAssert(score !== undefined); // Why is this needed?

            const onClick = () => {
                moves.setScore({category, score});
            };
            return <button onClick={onClick} disabled={playerToScore !== playerID}>
                {scoreOptions[category]}
            </button>;
        }
    };

    const scoreELems = [];
    for(const category of scoreCategories) {
        scoreELems.push(<Se key={category+"1"}>{displayName[category]}</Se>);
        scoreELems.push(<Se key={category+"2"}>{scoreElement(category)}</Se>);
    }
    scoreELems.push(<Se key={"Total1"}>TOTAL</Se>);
    scoreELems.push(<Se key={"Total2"}>{totalScore(scoreCard)}</Se>);

    return <ScoreCardDiv>
        <Name>{name}</Name>
        {scoreELems}
    </ScoreCardDiv>;
}