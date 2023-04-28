import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { illegalMoveNotication } from "./illegal-move-notification";
import { Discards } from "./discard-piles";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";
import { PlayerInfo } from "./player-info";

const HeaderLine = styled.div<{hideButton: boolean, errorMessage: boolean}>`
    display: flex;
    margin-bottom: 2px;

    color: ${props => props.errorMessage ? "yellow" : "currentcolor"};
    button {
        margin-left: 0.5em;
        visibility: ${props => props.hideButton ? "hidden" : "visible"};
    };
`;

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

interface Props {
    playerInfo: PlayerInfo;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerInfo } = props;
    const { getPlayerName, moves, G } = useGameContext();
    const { undoItems } = G;

    let canUndo = false;
    const standardMessage = () => {
        let message = getPlayerName(playerInfo.owner);
        if (playerInfo.owner === playerInfo.currentPlayer) {
            if (playerInfo.owner === playerInfo.viewer) {
                message += " (Your turn)";
                canUndo = undoItems.length > 0;
            }
            else {
                message += " (Their turn)";
            }
        }
        return message;
    };

    const notification = illegalMoveNotication(G, playerInfo);

    return <OuterDiv>
        <HeaderLine 
            hideButton={!canUndo} 
            errorMessage={Boolean(notification)}
        >
            <span>{notification || standardMessage()}</span>
            <button onClick={() => moves.undo()}>Undo</button>
        </HeaderLine>

        <InnerDiv>
            <MainPile playerInfo={playerInfo}/>
            <Discards playerInfo={playerInfo}/>
            <Hand playerInfo={playerInfo}/>  
        </InnerDiv>
    </OuterDiv>;
}
