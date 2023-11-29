import React from "react";
import styled from "styled-components";
import { MoveHistory } from "./move-history";
import { MainGameArea } from "./main-game-area";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { AvailableWords } from "./available-words";

const Game = styled.div`
    display: flex;

    // A margin between items
    > * + * {
        margin-left: 10px;
    }

    margin: 6px;
    margin-left:30px;
`;

const RightSide = styled.div`
    display: flex;

    margin-top: 70px;  // KLUDGE

    // A margin between items
    > * + * {
        margin-left: 10px;
    }
`;

export function Board(): JSX.Element {
    const context = useScrabbleContext();

    return (
        <Game>
            <MainGameArea />
            <RightSide>
                <MoveHistory moveHistory={context.moveHistory} />
                <AvailableWords />
            </RightSide>
        </Game>
    );
}

