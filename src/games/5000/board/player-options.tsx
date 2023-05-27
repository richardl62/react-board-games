import React from "react";
import { useGameContext } from "../client-side/game-context";
import { availablePlayerActions } from "../utils/available-player-actions";

export function PlayerOptions() : JSX.Element {
    const { G, moves } = useGameContext();

    const availableActions = availablePlayerActions(G);
    const showRoll = !availableActions.bust;
    return <div>
        {showRoll && <button 
            onClick={() => moves.roll()} 
            disabled={!availableActions.roll}>
            Roll
        </button>
        }
        {availableActions.rollAll && 
            <button 
                onClick={() => moves.rollAll()}>
                Roll All
            </button>
        }
        {availableActions.endTurn && 
            <button 
                onClick={() => moves.endTurnNotBust()}>
                Done
            </button>
        }
        {availableActions.bust && 
            <button 
                onClick={() => moves.endTurnBust()}>
            Bust
            </button>
        }
    </div>;
}