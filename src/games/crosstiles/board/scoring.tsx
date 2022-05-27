import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { getIllegalWords } from "../client-side/check-grid/check-grid";
import { GameStage } from "../server-side/server-data";
import { TileGrid } from "./tile-grid";

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
        <span>Grid contains illegal words:</span>
        {words.map((word, index) => <span key={index}>{word}</span>)}
    </IllegalWordsSpan>;
}

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerToScore, playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;
  
    if(stage !== GameStage.scoring) {
        return null;
    }

    sAssert(playerToScore);
    
    const name = getPlayerName(playerToScore);
    const { grid } = playerData[playerToScore];
    sAssert(grid, "Unexpected null grid");


    const illegalWords = getIllegalWords(grid);

    return <div>
        <Header>{`${name} to score`}</Header>
        <TileGrid letters={grid} />
        <IllegalWords words={illegalWords} />
    </div>;
}

