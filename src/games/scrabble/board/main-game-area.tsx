import React from "react";
import styled from "styled-components";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { MainBoard } from "./main-board";
import { RackAndControls } from "./rack-and-controls";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";
import { RewindControls } from "./rewind-controls";
import { HighScoringWordsControls } from "./high-scoring-words-controls";
import { ScoreLine } from "./score-line";

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
`;

const MainBoardDiv = styled.div`
  display: flex;
`;

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

function BagInfo(): JSX.Element {
    const context = useScrabbleContext();

    return <div>
        Tiles in bag: <span>{context.nTilesInBag}</span>
    </div>;
}

export function MainGameArea(): JSX.Element {
    const { reviewGameHistory } = useScrabbleContext();
    return <Game>
        <ScoresEtc />
        <RackAndControls />
        <MainBoardDiv>
            <MainBoard />
        </MainBoardDiv>
        <SpaceBetween>
            <WordChecker />
            <BagInfo />
        </SpaceBetween>

        {reviewGameHistory ? <RewindControls /> : <TurnControl />}
        <HighScoringWordsControls />
        <ScoreLine/>
    </Game>;
}
