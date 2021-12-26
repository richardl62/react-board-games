import { WaitingForPlayers } from "../../../game-support/waiting-for-players";
import React from "react";
import styled from "styled-components";
import { MoveHistory } from "./move-history";
import { MainGameArea } from "./main-game-area";
import { useScrabbleContext } from "./scrabble-context";

const Game = styled.div`
    display: flex;
    align-items: start;

    >:nth-of-type(2) { 
        margin-left: 20px;
        margin-top: 70px;  // KLUDGE
    }
`;

export function Board(): JSX.Element {
    const context = useScrabbleContext();

    if(!context.bgioProps.allJoined) {
        <WaitingForPlayers {...context.bgioProps} />;
    }

    const moveHistory = context.bgioProps.G.moveHistory;

    return (
        <Game>
            <MainGameArea />
            <MoveHistory moveHistory={moveHistory} />
        </Game>
    );
}

