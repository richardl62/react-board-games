import React from "react";
import { Scores } from "./scores";
import { GameButtons } from "./game-buttons";
import { ScorePads } from "./score-pads";
import styled from "styled-components";
import { GameDiceSet } from "./game-dice-set";

const OuterDiv = styled.div`
    padding: 10px;
`;

function Board() : JSX.Element {
 
    return <OuterDiv>
        <GameButtons/>
        <GameDiceSet/>
        <Scores/>
        <ScorePads />
    </OuterDiv>;
}

export default Board;

