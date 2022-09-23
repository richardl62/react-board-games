import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { Hand } from "../../../utils/cards";
import styled from "styled-components";
import { CardID } from "../../../utils/cards/card-dnd";
import { PlayerID } from "../client-side/game-state";

const InlineFlex = styled.div`
    display: inline-flex;
`;

interface PlayerCardsProps {
    playerID: PlayerID;
}

export function PlayerCards(props: PlayerCardsProps) : JSX.Element {
    const { playerID } = props;

    const context = useCribbageContext();
    const { dispatch } = context;
    const cards = context[playerID].hand;

    const dragEnd = useCallback((arg: {from:CardID, to: CardID}) => {
        dispatch({
            type: "drag",
            data: arg,
        });

    },[]);
       
    return <Hand cards={cards} handID={playerID} dragEnd={dragEnd} dropTarget />;
}

export function SharedCards() : JSX.Element {
    const { box } = useCribbageContext();

    return <InlineFlex>
        <Hand cards={box} />
        <Hand cards={[null]} handID={"dropSpot"} dropTarget />
    </InlineFlex>;
}
