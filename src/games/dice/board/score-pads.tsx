import React from "react";
import styled from "styled-components";
import { ScorePad } from "../../../utils/score-pad";

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
    return <ScorePadsDiv>
        <ScorePad name="Player 1" active={true} score={10} partialScore={null} previousScores={[1000, 2, 3, 4, 5]} />
        <ScorePad name="Player 2" active={false} score={null} partialScore={20} previousScores={[1, 2, 3, 4, 5]} />
    </ScorePadsDiv>;
}