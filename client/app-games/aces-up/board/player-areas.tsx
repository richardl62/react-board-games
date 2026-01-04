import { JSX } from "react";
import styled from "styled-components";
import { rotateArray } from "@utils/rotate-array";
import { useMatchState } from "../game-support/match-state";
import { rowGap } from "../game-support/styles";
import { PlayerArea } from "./player-area";
import { PlayerInfo } from "./player-info";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;

    row-gap: ${rowGap.betweenAreas};
`;

export function PlayerAreas() : JSX.Element {
    const context = useMatchState();
    const {  playerID, ctx: {playOrder} } = context;
    
    const playerIDs = [...playOrder];
    rotateArray(playerIDs, playerID);
    
    return <OuterDiv>
        {playerIDs.map(id => 
            <PlayerArea key={id} playerInfo={new PlayerInfo(context, id)}/>
        )}
    </OuterDiv>;
}