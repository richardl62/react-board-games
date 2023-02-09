import React from "react";
import styled from "styled-components";
import { rotateArray } from "../../../utils/rotate-array";
import { useGameContext } from "../client-side/game-context";

const PlayerAreaDiv = styled.div`
    border: black 1px solid;
`;

const PlayerAreasDiv = styled.div`
    display: inline-flex;
    flex-direction: column;

    > *:not(:last-child) {
        margin-bottom: 10px;
    }
`;

interface PlayerAreaProps {
    playerID: string;
}
function PlayerArea(props: PlayerAreaProps) {
    const { playerID: inputPlayerID } = props;

    const { events, playerID: contextPlayerID, 
        ctx: {currentPlayer},
        getPlayerName} = useGameContext();
    
    const showEndTurnButton = inputPlayerID === contextPlayerID;
    const allowEndTurn = inputPlayerID === currentPlayer;

    return <PlayerAreaDiv>
        <div>{getPlayerName(inputPlayerID)}</div>
        {showEndTurnButton && <button 
            onClick={() => events.endTurn()}
            disabled={!allowEndTurn}
        > 
            End Turn
        </button>}
    </PlayerAreaDiv>;
}

export function PlayerAreas() : JSX.Element {
    const {  playerID, ctx: {playOrder} } = useGameContext();
    
    const playerIDs = [...playOrder];
    rotateArray(playerIDs, playerID);
    
    return <PlayerAreasDiv>
        {playerIDs.map(id => 
            <PlayerArea key={id} playerID={id}/>
        )}
    </PlayerAreasDiv>;
}