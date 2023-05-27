import React from "react";
import { useGameContext } from "../client-side/game-context";
import { PlayerActions, availablePlayerActions } from "../utils/available-player-actions";

export function RollBustStop() : JSX.Element {
    const { G, moves } = useGameContext();

    const availableActions = availablePlayerActions(G);
    
    const onClick = (action: PlayerActions) => {
        if(action === "roll") {
            moves.roll();
        } else if (action === "rollAll") {
            moves.rollAll();
        } else if (action === "bust") {
            moves.bust();
        } else if (action === "done") {
            moves.endTurnWithScore(G.diceScores.held + G.scoreCarriedOver);
        } else {
            throw new Error(`Unrecognised action: ${action}`);
        }
    };

    return <div>
        {availableActions.map(action => 
            <button
                type="button" 
                key={action} 
                onClick={() => onClick(action)}
            >
                {action}
            </button>
        )}
    </div>;
}