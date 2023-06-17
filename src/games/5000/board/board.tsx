import React from "react";
import { Scores } from "./scores";
import { GameButtons } from "./game-buttons";
import { ScorePads } from "./score-pads";
import styled from "styled-components";
import { GameDiceSet } from "./game-dice-set";
import { ScoringCombinations } from "./scoring-combinations";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
    // Do not stretch content
    align-items: flex-start;

    padding: 10px;

    a {
        font-size: 18px;
    }
    
    //Add padding between items, EXCEPT the last item
    & > *:not(:last-child) {
        margin-bottom: 6px;
    }
`;

function Board() : JSX.Element {
 
    return <OuterDiv>
        <GameButtons/>
        <GameDiceSet/>
        <Scores/>
        <ScorePads />
        <ScoringCombinations/>
    </OuterDiv>;
}

export default Board;

