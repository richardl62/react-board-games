import React from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameRequest, GameStage } from "../server-side/server-data";
import { OuterDiv } from "./message-and-button";

function CardsLeft() {
    const context = useCribbageContext();
    const { moves, me } = context;

    const cardsPegged = context.shared.hand.length > 0;
    const restartPegging = () => moves.requestRestartPegging(me);
    const clearRequested = context[me].request === GameRequest.RestartPegging;

    return <>
        <span>Pegging</span>
        {cardsPegged && <button onClick={restartPegging} disabled={clearRequested}>Clear pegged cards</button>}
    </>;
}

export function Pegging() : JSX.Element | null {
    const context = useCribbageContext();
    const { stage, moves, me, pone } = context;

    if (stage !== GameStage.Pegging) {
        return null;
    }

    const cardsLeft = context[me].hand.length > 0 || context[pone].hand.length > 0;
    const revealHands = () => moves.requestRevealHands(me);
    const revealRequested = context[me].request === GameRequest.RevealHand;  

    return <OuterDiv> {
        cardsLeft ? 
            <CardsLeft /> :
            <button onClick={revealHands} disabled={revealRequested}>Reveal Hands</button>
    }</OuterDiv>;
}