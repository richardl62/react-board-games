import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { CardDraggable } from "./drag-drop";

const OuterDiv = styled.div`
    display: flex;
`;

interface Props {
    playerID: PlayerID;
}

export function Hand(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { hand } = playerData[inputPlayerID];
    return <OuterDiv> {
        hand.map((card,index) =>
            <CardDraggable 
                key={index} card={card}

                id={{area: "hand", index, owner: inputPlayerID}}
            />)
    } </OuterDiv>;
}
