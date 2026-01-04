import { JSX } from "react";
import styled from "styled-components";
import { useCribbageState } from "../client-side/cribbage-state";
import { GameRequest, GameStage } from "@game-control/games/cribbage/server-data";
import { MakingBox } from "./making-box";
import { Pegging } from "./pegging";

export const OuterDiv = styled.div`
    display: flex;

    font-size: 20px;
    button {
        margin-left: 10px;
    }
`;

function Scoring() {
    const context = useCribbageState();
    const { stage, moves, me } = context;

    if(stage !== GameStage.HandsRevealed) {
        return null;
    }

    const newDeal = () => moves.requestNewDeal(me);
    const requested = context[me].request === GameRequest.NewDeal;
    return <OuterDiv>
        <span>Scoring</span>
        <button onClick={newDeal} disabled={requested}>Done (new deal)</button>
    </OuterDiv>;
}

export function MessageAndButton() : JSX.Element {
    return <>
        <MakingBox />
        <Pegging />
        <Scoring />
    </>;
}