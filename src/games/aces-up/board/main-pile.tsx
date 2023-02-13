import React from "react";
import { useGameContext } from "../client-side/game-context";
import { CardDraggable } from "./drag-drop";

interface Props {
    playerID: string;
}

export function MainPile(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { mainPile } = playerData[inputPlayerID];
    const message = `${mainPile.length} cards`;

    return <div>
        <CardDraggable 
            card={mainPile[0]} 
            location={{area: "playerPile", owner: inputPlayerID}}
        />

        <div>{message}</div>
    </div>;
}
