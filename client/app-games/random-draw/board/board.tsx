import { JSX } from "react";
import { useGameContext } from "../game-context";

function PlayerValues(props: {pid: string}) : JSX.Element {
    const {
        G: {playerValues},
        ctx: {currentPlayer},
        playerData,
        moves,

     } = useGameContext();
    const values = playerValues[props.pid];
    const { name, status } = playerData[props.pid];

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
        playerData, 
        playerID
    } = useGameContext();
    
    const playerValues = playOrder.map((pid) => {
        return <PlayerValues key={pid} pid={pid} />
    });

    const name = (id: string) => playerData[id].name;
    
    return <div>
        <div>
            {`Board for ${name(playerID)} (ID ${playerID}): `}
            {`Current player is ${name(currentPlayer)} (ID ${currentPlayer})`}
        </div>
        <div>{playerValues}</div>
    </div>;
}

export default Board;

