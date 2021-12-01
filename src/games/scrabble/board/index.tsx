import { WaitingForPlayers } from "../../../game-support/waiting-for-players";
import React from "react";
import styled from "styled-components";
import { GameProps } from "./game-props";
import { MoveHistory } from "./move-history";
import { MainGameArea } from "./main-game-area";

const Game = styled.div`
    display: flex;
    align-items: start;

    >:nth-of-type(2) { 
        margin-left: 20px;
        margin-top: 70px;  // KLUDGE
    }
`;

export function Board(props: GameProps): JSX.Element {

    if(!props.bgioProps.allJoined) {
        <WaitingForPlayers {...props.bgioProps} />;
    }

    const moveHistory = props.bgioProps.G.moveHistory;

    return (
        <Game>
            <MainGameArea {...props} />
            <MoveHistory moveHistory={moveHistory} />
        </Game>
    );
}

