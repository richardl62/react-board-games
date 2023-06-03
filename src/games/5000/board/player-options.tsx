import React from "react";
import { useGameContext } from "../client-side/game-context";
import { availablePlayerActions } from "../utils/available-player-actions";
import styled from "styled-components";

const OuterDiv = styled.div<{visible: boolean}>`
    visibility: ${props => props.visible ? "visible" : "hidden"};
`;

export function PlayerOptions() : JSX.Element {
    const { G, moves, playerID, ctx: {currentPlayer} } = useGameContext();
    const isActivePlayer = playerID === currentPlayer;
    const availableActions = availablePlayerActions(G);
    const showRoll = !availableActions.bust;
    return <OuterDiv visible={isActivePlayer}>
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
    </OuterDiv>;
}