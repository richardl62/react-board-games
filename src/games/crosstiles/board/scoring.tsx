import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { nBonuses } from "../client-side/check-grid/check-grid";
import { bonusScore } from "../config";
import { ScoreCategory } from "../server-side/score-categories";
import { GameStage } from "../server-side/server-data";
import { ScoreCard } from "./score-card";
import { scoreOptions } from "../client-side/check-grid/score-options";
import { TileGrid } from "./tile-grid";

const ScoringDiv = styled.div`
    display: flex;
    align-items: center;

    > *:first-child {
        margin-right: 5px;
    }
    font-size:large;
    margin-bottom: 6px;
`;

// const IllegalWordsSpan = styled.div`
//   span:first-child {
//       color: red;
//       font-weight: bold;
//   };  

//   span {
//       margin-right: 0.25em;
//   };
// `;

// function IllegalWords({words} : {words: string[] | null} ) {
//     if(!words) {
//         return null;
//     }

//     return <IllegalWordsSpan>
//         <span>Illegal words:</span>
//         {words.map((word, index) => <span key={index}>{word}</span>)}
//     </IllegalWordsSpan>;
// }

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerToScore, playerData } = context;
    const { getPlayerName, moves, playerID } = context.wrappedGameProps;
  
    if(stage !== GameStage.scoring) {
        return null;
    }

    sAssert(playerToScore);
    
    const name = getPlayerName(playerToScore);
    const { scoreCard, grid } = playerData[playerToScore];
    sAssert(grid, "Unexpected null grid");


    const scoreOpts = scoreOptions(scoreCard, grid);

    let recordScore;
    if (playerToScore === playerID) {
        recordScore = (category: ScoreCategory, score: number) => {
            let bonus = 0;
            if (score > 0) {
                bonus = nBonuses(grid) * bonusScore;
            }
            moves.setScore({ category, score, bonus });
        };
    }

    return <div>
        <ScoringDiv>
            <TileGrid letters={grid} />
            <ScoreCard name={name} scoreCard={scoreCard} scoreOptions={scoreOpts}
                recordScore={recordScore} />
            <></>
        </ScoringDiv>
    </div>;
}
