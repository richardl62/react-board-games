import React from "react";
import styled from "styled-components";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../client-side/game-context";

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
            <CardSVG key={index} card={cards[0]}/>)
    } </OuterDiv>;
}
