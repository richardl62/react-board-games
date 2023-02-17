import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { CardDraggable } from "./drag-drop";

interface Props {
    playerID: string;
}

const NumCards = styled.div`
    font-size: 18px;

    text-align: center;
`;

export function MainPile(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { mainPile } = playerData[inputPlayerID];
    const message = `${mainPile.length} cards`;

    return <div>
        <CardDraggable 
            card={mainPile[0]} 
            id={{area: "playerPile", owner: inputPlayerID}}
        />

        <NumCards>{message}</NumCards>

    </div>;
}
