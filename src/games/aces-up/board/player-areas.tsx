import React from "react";
import styled from "styled-components";
import { rotateArray } from "../../../utils/rotate-array";
import { useGameContext } from "../client-side/game-context";
import { PlayerArea } from "./player-area";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;

    > *:not(:last-child) {
        margin-bottom: 10px;
    }
`;

export function PlayerAreas() : JSX.Element {
    const {  playerID, ctx: {playOrder} } = useGameContext();
    
    const playerIDs = [...playOrder];
    rotateArray(playerIDs, playerID);
    
    return <OuterDiv>
        {playerIDs.map(id => 
            <PlayerArea key={id} playerID={id}/>
        )}
    </OuterDiv>;
}