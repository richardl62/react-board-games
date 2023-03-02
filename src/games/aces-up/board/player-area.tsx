import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { IllegalMoveNotification } from "./illegal-move-notification";
import { Discards } from "./discard-piles";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";
import { PlayerInfo } from "./player-info";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    align-self: start;
`;

const InnerDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    column-gap: ${columnGap.betweenAreas};
`;

const Text = styled.div`
    margin-bottom: 2px;
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerInfo } = props;
    const { getPlayerName, undo, G: {undoAvailable} } = useGameContext();

    let message = getPlayerName(playerInfo.owner);
    let canUndo = false;
    if( playerInfo.owner === playerInfo.currentPlayer ) {
        if(playerInfo.owner === playerInfo.viewer) {
            message += " (Your turn)";
            canUndo = undoAvailable;
        }
        else {
            message += " (Their turn)";
        }
    }

    return <OuterDiv>
        <Text>{message}</Text>
        {canUndo && <button onClick={undo}>Undo</button>}
        <IllegalMoveNotification playerInfo={playerInfo}/>
        <InnerDiv>
            <MainPile playerInfo={playerInfo}/>
            <Discards playerInfo={playerInfo}/>
            <Hand playerInfo={playerInfo}/>  
        </InnerDiv>
    </OuterDiv>;
}
