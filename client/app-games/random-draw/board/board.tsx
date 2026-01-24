import { JSX } from "react";
import { useMatchState } from "../match-state";

function PlayerValues(props: {pid: string}) : JSX.Element {
    const {
        G: {playerValues},
        ctx: {currentPlayer},
        getPlayerName,
        getPlayerConnectionStatus,
        moves,

     } = useMatchState();
    const values = playerValues[props.pid];
    const name = getPlayerName(props.pid);
    const status = getPlayerConnectionStatus(props.pid);

    return <div>
        <span>{name}: {values.join(", ")}</span>
        <button onClick={() => moves.changeValues()}
            disabled={props.pid !== currentPlayer}
            >
            Draw
        </button>
        <span>{status}</span>
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
    
    return <div>
        <div>
            {`Board for ${name(playerID)} (ID ${playerID}): `}
            {`Current player is ${name(currentPlayer)} (ID ${currentPlayer})`}
        </div>
        <div>{playerValues}</div>
    </div>;
}

export default Board;

