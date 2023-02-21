import React from "react";
import { GameWarnings } from "../../../app-game-support";
import { debugOptionsInUse } from "../game-support/config";
import { useGameContext } from "../game-support/game-context";

export function Warnings() : JSX.Element {
    const ctx = useGameContext();

        
    return <>
        <GameWarnings {...ctx}/>
        {debugOptionsInUse() && <div>
            Warning: Debug options in use
        </div>}
    </>;
}