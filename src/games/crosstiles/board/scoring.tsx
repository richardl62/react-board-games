import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { GameStage } from "../server-side/server-data";
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

const IllegalWordsSpan = styled.div`
  span:first-child {
      color: black;
      font-weight: bold;
  };  

  span {
    color: red;
      margin-right: 0.25em;
  };
`;

function IllegalWords({words} : {words: string[] | null} ) {
    if(!words) {
        return null;
    }

    return <IllegalWordsSpan>
        <span>Illegal words:</span>
        {words.map((word, index) => <span key={index}>{word}</span>)}
    </IllegalWordsSpan>;
}

interface CompletedGridProps {
    pid: string;
}

function CompletedGrid({pid}: CompletedGridProps) {
    const context = useCrossTilesContext();
    const { playerData, isLegalWord } = context;
    const { getPlayerName } = context.wrappedGameProps;

    const name = getPlayerName(pid);
    const { grid } = playerData[pid];
    sAssert(grid, "Unexpected null grid");

    const { illegalWords } = checkGrid(
        playerData[pid].scoreCard, grid, isLegalWord);

    const scoreConfirmed = Boolean(playerData[pid].chosenCategory);

    return <div>
        <Header>{name}</Header>
        <TileGrid letters={grid} />
        <IllegalWords words={illegalWords} />
        {!scoreConfirmed && <div>Player must confirm score</div>}
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

