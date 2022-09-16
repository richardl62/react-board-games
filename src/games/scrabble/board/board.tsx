import { WaitingForPlayers } from "../../../app-game-support";
import React from "react";
import styled from "styled-components";
import { MoveHistory } from "./move-history";
import { MainGameArea } from "./main-game-area";
import { useScrabbleContext } from "../client-side/scrabble-context";

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

    if(!context.wrappedGameProps.allJoined) {
        <WaitingForPlayers {...context.wrappedGameProps} />;
    }

    return (
        <Game>
            <MainGameArea />
            <MoveHistory moveHistory={context.moveHistory} />
        </Game>
    );
}

