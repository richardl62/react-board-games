import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { columnValues } from "@shared/game-control/games/cant-stop/config";

export function BlockedSquares() : JSX.Element {
    const {
        G: {options},
        blockedSquares
    } = useMatchState();

    const colTexts = [];
    for (const col of columnValues) {
        const blocked = blockedSquares[col];
        if (blocked.includes(true))  {
            let text = `col ${col}:`;
            for (const ind in blockedSquares[col]) {
                if (blockedSquares[col][ind]) {
                    text += ` ${ind} `;
                }
            }
            colTexts.push(text);
        }
    }

    return <div>
        <div>{`Min clearance above: ${options.minClearanceAbove}`}</div>
        <div>{`Min clearance below: ${options.minClearanceBelow}`}</div>
        <div>Blocked Squares: </div>
        {colTexts.map((text, index) => <div key={index}>{text}</div>)}
        </div>
}