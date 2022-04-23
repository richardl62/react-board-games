import React from "react";
import styled from "styled-components";
import { displayName, scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { scoreCardBackgroundColor, scoreCardBoardColor } from "./style";
import { sAssert } from "../../../utils/assert";


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
    scoreCard: {[category: string]: number};
    scoreOptions?: {[category: string]: number}; 
}

export function ScoreCard(props: ScoreCardProps) : JSX.Element {
    const { name, scoreCard, scoreOptions } = props;
    const { moves } = useCrossTilesContext().wrappedGameProps;
    
    const scoreElement = (categoryString:string) => {

        const category = categoryString as ScoreCategory; // For now
        sAssert(scoreCategories.includes(category));
        
        if(scoreCard[category] !== undefined) {
            return scoreCard[category];
        }

        if(scoreOptions && scoreOptions[category] !== undefined) {
            const score = scoreOptions[category];
            const onClick = () => {
                moves.setScore({category, score});
            };
            return <button onClick={onClick}>{scoreOptions[category]}</button>;
        }
    };

    const scoreELems = [];
    for(const category of scoreCategories) {
        scoreELems.push(<Se>{displayName(category)}</Se>);
        scoreELems.push(<Se>{scoreElement(category)}</Se>);
    }

    return <ScoreCardDiv>
        <Name>{name}</Name>
        {scoreELems}
    </ScoreCardDiv>;
}

const ScoreCardsDiv = styled.div`
    display: flex;
    > * {
        margin-right: 10px;
    }
`;

export function ScoreCards() : JSX.Element {
    const { playerData, wrappedGameProps: {getPlayerName} } = useCrossTilesContext();
    const elems = [];
    for(const id in playerData) {
        const name = getPlayerName(id);
        const { scoreCard: scoreCard } = playerData[id];
        elems.push(<ScoreCard name={name} scoreCard={scoreCard} />);
    }
    return <ScoreCardsDiv>{elems}</ScoreCardsDiv>;
}