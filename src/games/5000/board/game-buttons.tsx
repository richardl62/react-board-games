import React from "react";
import { useGameContext } from "../client-side/game-context";
import { availablePlayerActions } from "../utils/available-player-actions";
import styled from "styled-components";
import { getScores } from "../utils/get-scores";
import { sAssert } from "../../../utils/assert";

const OuterDiv = styled.div<{visible: boolean}>`
    display: flex;

    visibility: ${props => props.visible ? "visible" : "hidden"};
    //Add padding between items
    & > * {
        margin-right: 6px;
    }

    padding-bottom: 6px;
`;

const BustButton = styled.button`
    color: red;
`;

function HoldScoredDiceButton() {
    const { G, holdAllowed, moves } = useGameContext(); 
    const {faces, held} = G;

    const {unusedFaces: nonScoringFaces} = getScores(faces);

    const toHold : boolean[] = Array(held.length).fill(true);

    const unHold = (face: number) => {
        for (let i = held.length - 1; i >= 0; i--) {
            if(toHold[i] && faces[i] === face) {
                toHold[i] = false;
                return;
            }
        }
        sAssert(false, "Could not find face to hold");
    };

    // Check if hold and toHold are the same
    let same = true;
    for(let i = 0; i < held.length; i++) {
        if(held[i] !== toHold[i]) {
            same = false;
            break;
        }
    }

    for(const face of nonScoringFaces) {
        unHold(face);
    }

    return <button 
        onClick={() => moves.setHeld(toHold)}
        disabled={same || !holdAllowed}
    >
        Hold Scoring Dice
    </button>;
}

export function GameButtons() : JSX.Element {
    const { G, moves, playerID, ctx: {currentPlayer} } = useGameContext();
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
    return <OuterDiv visible={isActivePlayer}>
        <HoldScoredDiceButton/>
        {showRoll && <button 
            onClick={() => roll("unheld")} 
            disabled={!availableActions.roll}>
            Roll
        </button>
        }
        {availableActions.rollAll && 
            <button 
                onClick={() => roll("all")}>
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
            <BustButton 
                onClick={() => moves.endTurnBust()}>
            Bust!
            </BustButton>
        }
        {G.options.manualDiceRolls && <input
            type="text"
            value={diceText}
            onChange={onChangeDiceText}
        />}
        {badDiceText && <div>Invalid dice values</div>}
    
    </OuterDiv>;
}