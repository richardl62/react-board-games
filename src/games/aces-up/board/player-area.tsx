import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { illegalMoveNotication } from "./illegal-move-notification";
import { Discards } from "./discard-piles";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";
import { PlayerInfo } from "./player-info";

const HeaderLine = styled.div<{errorMessage: boolean}>`
    display: flex;
    margin-bottom: 2px;

    color: ${props => props.errorMessage ? "yellow" : "currentcolor"};
`;

const UndoButton = styled.button<{visible: boolean}>`
    margin-left: 0.5em;
    visibility: ${props => props.visible ? "visible" : "hidden"};
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
    const { getPlayerName, moves, G, ctx: {currentPlayer} } = useGameContext();
    const { undoItems } = G;

    let allowUndo = false;
    const standardMessage = () => {
        let message = getPlayerName(playerInfo.owner);
        if (playerInfo.owner === currentPlayer) {
            if (playerInfo.owner === playerInfo.viewer) {
                message += " (Your turn)";
                allowUndo = undoItems.length > 0;
            }
            else {
                message += " (Their turn)";
            }
        }
        return message;
    };

    const notification = illegalMoveNotication(G, playerInfo);

    return <OuterDiv>
        <HeaderLine errorMessage={Boolean(notification)} >
            <span>{notification || standardMessage()}</span>
            <UndoButton 
                visible={allowUndo}
                onClick={() => moves.undo()}
            >
                Undo
            </UndoButton>
        </HeaderLine>

        <InnerDiv>
            <MainPile playerInfo={playerInfo}/>
            <Discards playerInfo={playerInfo}/>
            <Hand playerInfo={playerInfo}/>  
        </InnerDiv>
    </OuterDiv>;
}
