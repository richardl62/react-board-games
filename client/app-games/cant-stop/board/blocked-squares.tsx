import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { columnValues, maxColumnHeight } from "@shared/game-control/games/cant-stop/config";

export function BlockedSquares() : JSX.Element {
    const {
        G: {options},
        playerID,
        isBlocked,
        currentlyBlockedColumns,
    } = useMatchState();

    const colTexts = [];
    for (const col of columnValues) {
        let blocked = "";
        for (let height = 0; height < maxColumnHeight(col) ; height++) {
            if(isBlocked({playerID, column: col, height})) {
                blocked += `${height} `;
            }
        }

        if (blocked.length > 0) {
            colTexts.push(`-col ${col}: ${blocked}`);
        }
    }

    return <div>
        <div>{`Min clearance above: ${options.minClearanceAbove}`}</div>
        <div>{`Min clearance below: ${options.minClearanceBelow}`}</div>
        <div>Blocked Squares: </div>
        {colTexts.map((text, index) => <div key={index}>{text}</div>)}
        <div>Currently Blocked Columns: {currentlyBlockedColumns.join(", ")}</div>
        </div>
}