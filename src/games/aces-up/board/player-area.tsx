import React from "react";
import styled from "styled-components";
import { useGameContext } from "../client-side/game-context";

const OuterDiv = styled.div`
    border: black 1px solid;
`;

interface Props {
    playerID: string;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    const { events, playerID: contextPlayerID, ctx: { currentPlayer }, getPlayerName } = useGameContext();

    const showEndTurnButton = inputPlayerID === contextPlayerID;
    const allowEndTurn = inputPlayerID === currentPlayer;

    return <OuterDiv>
        <div>{getPlayerName(inputPlayerID)}</div>
        {showEndTurnButton && <button
            onClick={() => events.endTurn()}
            disabled={!allowEndTurn}
        >
            End Turn
        </button>}
    </OuterDiv>;
}
