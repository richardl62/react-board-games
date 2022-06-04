import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
import { TileGrid } from "./tile-grid";

const ScoringDiv = styled.div`
    display: flex;  
    > * {
        margin-right: 1em;
    }
`;

const Header = styled.div`
    font-weight: bold;    
`;


interface CompletedGridProps {
    pid: string;
}

function CompletedGrid({pid}: CompletedGridProps) {
    const context = useCrossTilesContext();
    const { playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;

    const name = getPlayerName(pid);
    const { scoreCard, grid, chosenCategory } = playerData[pid];
    sAssert(grid, "Unexpected null grid");
    
    // Kludge??: Ignore any recently chosed option when showing
    // the grid status. This avoids misleading reported status, e.g.
    // that a recently scored options is unavailable. 
    const originalScoreCard = {...scoreCard};
    if (chosenCategory) {
        originalScoreCard[chosenCategory] = undefined;
    }
    
    return <div>
        <Header>{name}</Header>
        <TileGrid letters={grid} />
        <GridStatus grid={grid} scoreCard={originalScoreCard} />
    </div>;
}

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData } = context;
    if(stage !== GameStage.scoring) {
        return null;
    }

    return <ScoringDiv>
        {Object.keys(playerData).map(pid => <CompletedGrid key={pid} pid={pid} />)}
    </ScoringDiv>;
}

