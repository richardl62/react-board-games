import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { BoxWithLegend } from "../../../utils/box-with-legend";
import { ScoreCard } from "./score-card"; 

const ScoreCardsDiv = styled.div`
    display: flex;
    > * {
        margin-right: 10px;
    }
`;

export function ScoreCards(): JSX.Element {
    const { playerData, wrappedGameProps: { getPlayerName } } = useCrossTilesContext();
    const elems = [];
    for (const id in playerData) {
        const name = getPlayerName(id);
        const { scoreCard: scoreCard } = playerData[id];
        elems.push(<ScoreCard key={id} name={name} scoreCard={scoreCard} />);
    }
    return <BoxWithLegend legend={"Scores so far"}>
        <ScoreCardsDiv>{elems}</ScoreCardsDiv>
    </BoxWithLegend>;
}
