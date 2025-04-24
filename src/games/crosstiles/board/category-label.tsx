import { JSX } from "react";
import styled from "styled-components";
import { categoryDescription, displayName, FixedScoreCategory, fixedScores, ScoreCategoryOrTotal } from "../score-categories";
import { scoreCardBackgroundColor } from "./style";

const CategoryLabelDiv = styled.div`
    position: relative;

    :hover {
        div {
            display: inline-block;
        } ;
     } 
`;

const Label = styled.div`
    position: relative;
    z-index: 1;

     background-color: ${scoreCardBackgroundColor};
     padding: 1px;
`;

const Description = styled.div`
    position: absolute;
    z-index: 2;

    display: none;
    top: 2px;
    left: 2px;
    width: 19em;

    border: 1px solid black;
    background: white;
`;

interface CategoryLabelProps {
    category: ScoreCategoryOrTotal;
}
export function CategoryLabel({ category }: CategoryLabelProps): JSX.Element {

    let labelText = displayName[category];
    
    const fixedScore = fixedScores[category as FixedScoreCategory];
    if(fixedScore) {
        labelText += ` (${fixedScore})`;
    }
    return <CategoryLabelDiv>
        <Label>{labelText}</Label>
        <Description>{categoryDescription[category]}</Description>
    </CategoryLabelDiv>;
}
