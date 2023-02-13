import React from "react";
import styled from "styled-components";
import { useGameContext } from "../client-side/game-context";
import { DiscardPile } from "./discard-pile";

const OuterDiv = styled.div`
    display: flex;
`;

interface Props {
    playerID: string;
}

export function Discards(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { discards } = playerData[inputPlayerID];
    return <OuterDiv> {
        discards.map((cards,index) =>
            <DiscardPile key={index} cards={cards} index={index} owner={inputPlayerID}/>)
    } </OuterDiv>;
}
