import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { CardDraggable } from "./drag-drop";
import { PlayerInfo } from "./player-info";

const NumCards = styled.div`
    font-size: 18px;

    text-align: center;
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function MainPile(props: Props) : JSX.Element {
    const { playerInfo } = props;

    const { mainPile } = useGameContext().G.getPlayerData(playerInfo.owner);

    const message = `${mainPile.length} cards`;

    return <div>
        <CardDraggable 
            card={mainPile[mainPile.length-1]} 
            id={{area: "playerPile", owner: playerInfo.owner}}
        />

        <NumCards>{message}</NumCards>

    </div>;
}
