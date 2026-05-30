// This code is intended only for test purposes.
import { JSX } from "react";
import { useMatchState } from "../match-state";
import styled from "styled-components";

const OuterDiv = styled.div`
    margin: 10px;
    margin-bottom: 30px;
`;

function PlayerValues(props: {pid: string}) : JSX.Element {
    const {
        G: {playerValues},
        ctx: {currentPlayer},
        playerID,
        getPlayerName,
        moves,
        events,

     } = useMatchState();
    const values = playerValues[props.pid];
    const name = getPlayerName(props.pid);

    const active = currentPlayer === playerID && props.pid === playerID;

    return <div>
        <span>{name}: {values.join(", ")}</span>
        <button onClick={() => moves.draw()}
            disabled={props.pid !== currentPlayer}
            >
            Draw
        </button>

        <button onClick={() => events.endTurn()}
            disabled={props.pid !== currentPlayer}
            >
            End Turn
        </button>

        <button onClick={() => moves.throwError(undefined)}
            disabled={props.pid !== currentPlayer}
            >
            throw Error
        </button>
        {active && <span> - active </span>}

    </div>;
}

function Board() : JSX.Element {
    const {
        ctx: {playOrder, currentPlayer}, 
        getPlayerName,
        playerID
    } = useMatchState();
    
    const playerValues = playOrder.map((pid) => {
        return <PlayerValues key={pid} pid={pid} />
    });

    const name = (id: string) => getPlayerName(id);
    
    return <OuterDiv>
        <div>Board for {name(playerID)}</div>
        <div>Current player is {name(currentPlayer)}</div>
        <div>{playerValues}</div>
    </OuterDiv>;
}

export default Board;

