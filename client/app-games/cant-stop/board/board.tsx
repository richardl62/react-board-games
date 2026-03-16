import { JSX } from "react";
import { TurnControl } from "./turn-control";
import { Columns } from "./columns";
import { PlayerNames } from "./player-names";
import styled from "styled-components";
import { useMatchState } from "../match-state/match-state";
import { playerColor } from './styles';

const BoardContainer = styled.div<{currentPlayerColor: string}>`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    --currentPlayerColor:${props => props.currentPlayerColor };
`;

const Messages = styled.div`
    align-self: flex-start;
    margin-left: 1em;
`;

function Options() {
    const { G: { options :{ minClearanceAbove, minClearanceBelow }} } = useMatchState();
    return <Messages>
        {minClearanceAbove !== 0 && <div>Minimum clearance above: {minClearanceAbove}</div>}
        {minClearanceBelow !== 0 && <div>Minimum clearance below: {minClearanceBelow}</div>}
    </Messages>
}

function Board() : JSX.Element {
    const {ctx} = useMatchState();

    return <BoardContainer currentPlayerColor={playerColor(ctx.currentPlayer)}>
        <PlayerNames/>
        <Columns/>
        <TurnControl/>
        <Options/>
    </BoardContainer>
}

export default Board;

