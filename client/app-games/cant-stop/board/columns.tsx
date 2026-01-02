import { JSX } from "react";
import { useGameContext } from "../game-context";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";

function columnHieghts(playerData: ColumnHeight[]) : string  {
    let str: string = "";
    for (const col of columnValues) {
        const owned = playerData[col].owned;
        const thisTurn = playerData[col].thisTurn;
        str += ` ${col}:${owned}`;
        if (thisTurn !== owned) {
            str += `(${thisTurn})`;
        }   
    }
    return str;
}

// Very crude presention of column heights.
export function Columns() : JSX.Element {
        const {
            G,
            ctx: {playOrder}, 
            playerData, 
        } = useGameContext();

    const result: JSX.Element[] = [];
    for(const pid of playOrder) {
        result.push(<div>
            <span>{`Player ${playerData[pid].name} - ${columnHieghts(G.columnHeights[pid])}`}</span>
        </div>);
    }
    return <>{result}</>;
}