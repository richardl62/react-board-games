import React from "react";
import styled from "styled-components";
import { ScoreCategory, displayName, fixedScores, FixedScoreCategory } from "../server-side/score-categories";
import { scoreCardBackgroundColor } from "./style";

const CategoryLabelDiv = styled.div<{recentlyChosen?: boolean}>`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
    text-decoration: ${props => props.recentlyChosen ? "underline" : "none" };
`;

interface CategoryLabelProps {
    category: ScoreCategory;
}
export function CategoryLabel({ category }: CategoryLabelProps): JSX.Element {

    let text = displayName[category];
    
    const fixedScore = fixedScores[category as FixedScoreCategory];
    if(fixedScore) {
        text += ` (${fixedScore})`;
    }
    return <CategoryLabelDiv>
        {text}
    </CategoryLabelDiv>;
}
