import { JSX } from "react";
import { TurnControl } from "./turn-control";
import { Columns } from "./columns";
import { PlayerNames } from "./player-names";
import styled from "styled-components";

const BoardContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
`;

function Board() : JSX.Element {
    return <BoardContainer>
        <PlayerNames/>
        <Columns/>
        <TurnControl/>
    </BoardContainer>
}

export default Board;

