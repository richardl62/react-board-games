import React from "react";
import styled from "styled-components";
import { displayName, scoreCategories, ScoreCategory } from "../server-side/score-categories";
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

interface SimpleScoreCardProps {
    name: string;
    scoreCard: ScoreCardType;
    scoreOptions?: undefined;
    recordScore?: undefined;  
}

interface FullScoreCardProps {
    name: string;
    scoreCard: ScoreCardType;
    scoreOptions: ScoreCardType;
    /** If omitted score options are displays, but there functionality is disabled */
    recordScore?: (category: ScoreCategory, score: number) => void;  
}

type ScoreCardProps = SimpleScoreCardProps | FullScoreCardProps;

export function ScoreCard(props: ScoreCardProps) : JSX.Element {
    const { name, scoreCard, scoreOptions, recordScore } = props;
    
    const scoreElement = (category: ScoreCategory) => {
        
        if(scoreCard[category] !== undefined) {
            return scoreCard[category];
        }

        if(scoreOptions && scoreOptions[category] !== undefined) {
            const score = scoreOptions[category];
            sAssert(score !== undefined); // Why is this needed?

            const onClick = recordScore && (() => {
                recordScore(category, score);
            });
            return <button onClick={onClick} disabled={!recordScore}>
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