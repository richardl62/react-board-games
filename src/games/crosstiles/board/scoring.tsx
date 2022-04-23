import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { ScoreCard as ScoreCardType, scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { GameStage } from "../server-side/server-data";
import { ScoreCard } from "./score-card";

const ScoringDiv = styled.div`
    display: flex;
    font-size:large;
    margin-bottom: 6px;
`;

/** Return the subset of validScores that are not already filled on the score card. Or
 * return null, if there are no such scores.
 */
function scoreOptions(
    scoreCard: ScoreCardType,
    validScores:  { [category in ScoreCategory] : number | false }
) {
    const options: ScoreCardType = {};

    for(const category of scoreCategories) {
        if(scoreCard[category] === undefined) {
            const scoreOption = validScores[category];
            if(scoreOption !== false) {
                options[category] = scoreOption;
            }
        }
    } 

    return Object.keys(options).length === 0 ? null : options;
}

function zeroScores(scoreCard: ScoreCardType) {
    const zeros: ScoreCardType = {};

    for(const category of scoreCategories) {
        if(!scoreCard[category] !== undefined) {
            zeros[category] = 0;
        }
    } 

    sAssert(Object.keys(zeros).length > 0, "Cannot zero any scores");

    return zeros;
}

const IllegalWordsSpan = styled.div`
  span:first-child {
      color: red;
      font-weight: bold;
  };  

  span {
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
export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerToScore, playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;
  
    if(stage !== GameStage.scoring) {
        return null;
    }

    sAssert(playerToScore);
    
    const name = getPlayerName(playerToScore);
    const { scoreCard, grid } = playerData[playerToScore];
    sAssert(grid, "Unexpected null grid");

    const {illegalWords, validScores} = checkGrid(grid);
    let scoreOpts = scoreOptions(scoreCard, validScores);

    if (illegalWords || !scoreOpts) {
        scoreOpts = zeroScores(scoreCard);
    }
    
    return <div>
        <IllegalWords words={illegalWords} />
        <ScoringDiv>
            <ScoreCard name={name} scoreCard={scoreCard} scoreOptions={scoreOpts} />
        </ScoringDiv>
    </div>;
}