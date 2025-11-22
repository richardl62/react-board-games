import React, { JSX } from "react";
import { useGameContext } from "../client-side/game-context";
import { availablePlayerActions } from "@game-control/games/5000/utils/available-player-actions";
import styled from "styled-components";
import { HoldScoringDiceButton } from "./hold-scoring-dice-button";

const OuterDiv = styled.div`
    display: flex;

    //Add padding between items
    & > * {
        margin-right: 6px;
    }
`;

const BustButton = styled.button`
    color: red;
`;

export function GameButtons() : JSX.Element {
    const { G, moves, playerID, ctx: {currentPlayer, matchover} } = useGameContext();
    const [diceText, setDiceText] = React.useState("");
    const [badDiceText, setBadDiceText] = React.useState(false);

    const onChangeDiceText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiceText(e.target.value);
        setBadDiceText(false);
    };

    const roll = (type: "unheld" | "all") => {
        const trimmed = diceText.trim();
        if (trimmed.length === 0) {
            moves.roll({type});
            return;
        }

        const faces = trimmed.split(/\s+/).map(x => parseInt(x));

        if (faces.length !== 6 || faces.some(x => isNaN(x) || x < 1 || x > 6)) {
            setBadDiceText(true);
            return;
        }
        moves.roll({type, faces: faces});
    };

    const isActivePlayer = playerID === currentPlayer;
    const availableActions = availablePlayerActions(G);
    const showRoll = !availableActions.bust;
    const allButtonsDisabled = matchover || !isActivePlayer;
    return <OuterDiv>
        <HoldScoringDiceButton/>
        {showRoll && <button 
            onClick={() => roll("unheld")} 
            disabled={allButtonsDisabled || !availableActions.roll}
        >
            Roll
        </button>
        }
        {availableActions.rollAll && 
            <button 
                onClick={() => roll("all")}
                disabled={allButtonsDisabled}
            >
                Roll All
            </button>
        }
        {availableActions.endTurn && 
            <button 
                onClick={() => moves.endTurnNotBust()}
                disabled={allButtonsDisabled}
            >
                Done
            </button>
        }
        {availableActions.bust && 
            <BustButton 
                onClick={() => moves.endTurnBust()}
                disabled={allButtonsDisabled}
            >
            Bust!
            </BustButton>
        }
        {G.options.manualDiceRolls && <input
            type="text"
            value={diceText}
            onChange={onChangeDiceText}
            disabled={allButtonsDisabled}
        />}
        {badDiceText && <div>Invalid dice values</div>}
    
    </OuterDiv>;
}