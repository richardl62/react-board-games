import React from "react";
import { sAssert } from "../../../utils/assert";
import { getScores } from "../utils/get-scores";
import { categoryName } from "../utils/dice-score";
import styled from "styled-components";

const Score = styled.div`
    font-family: helvetica;
    // First span is bold
    & > span:first-child {
        font-weight: bold;
        margin-right: 0.5em;
    }
`;

export function ShowWithCategories({faces, held}: {
    faces: number[];
    held: boolean[];
}) :  JSX.Element 
{
    sAssert(faces.length === held.length);
    const heldFaces = faces.filter((_, index) => held[index]);
    const scores = getScores(heldFaces);
    
    let total = 0;
    const details : string[] = [];
    for(const k in scores) {
        const key = k as keyof typeof scores;
        const score = scores[key];
        total += score;
        if(score !== 0) {
            const name = categoryName(key).toLocaleLowerCase();
            details.push(`${name}: ${score}`);
        }
    }

    return <Score>
        <span>{`Score: ${total}`}</span>
        {total > 0 && <span>{`(${details.join(", ")})`}</span>}
    </Score>;
}