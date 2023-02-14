import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { Discards } from "./discards";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";

const OuterDiv = styled.div`
`;

const InnerDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    > *:not(:last-child) {
        margin-right: 10px;
    };
`;

interface Props {
    playerID: string;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    const { playerID: contextPlayerID, getPlayerName } = useGameContext();


    return <OuterDiv>
        <div>{getPlayerName(inputPlayerID)}</div>
        <InnerDiv>
            <MainPile playerID={inputPlayerID}/>
            <Discards playerID={inputPlayerID}/>
            { inputPlayerID === contextPlayerID && <Hand playerID={inputPlayerID}/> }  
        </InnerDiv>
    </OuterDiv>;
}
