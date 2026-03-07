import { JSX } from "react";
import { TurnControl } from "./turn-control";
import { Columns } from "./columns";
import { PlayerNames } from "./player-names";
import styled from "styled-components";
import { useMatchState } from "../match-state/match-state";
import { playerColor } from './styles';

const BoardContainer = styled.div<{playerColor: string}>`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    --playerColor:${props => props.playerColor };
`;

function Board() : JSX.Element {
    const {playerID} = useMatchState();
    return <BoardContainer playerColor={playerColor(playerID)}>
        <PlayerNames/>
        <Columns/>
        <TurnControl/>
    </BoardContainer>
}

export default Board;

