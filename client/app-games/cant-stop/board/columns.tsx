import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";

function columnHieghts(playerData: ColumnHeight[]) : string  {
    let str: string = "";
    for (const col of columnValues) {
        str += ` ${col}:`;

        const {owned, thisTurn, thisScoringChoice} = playerData[col];
        if(owned === thisTurn && thisTurn === thisScoringChoice) {
            str += owned;
        } else {
            str += `${owned}-${thisTurn}-${thisScoringChoice}`;
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
        } = useMatchState();

    const result: JSX.Element[] = [];
    for(const pid of playOrder) {
        result.push(<div key={pid}>
            <span>{`${playerData[pid].name} has ${columnHieghts(G.columnHeights[pid])}`}</span>
        </div>);
    }
    return <>{result}</>;
}