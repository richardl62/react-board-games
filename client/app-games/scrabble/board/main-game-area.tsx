import { JSX, useState } from "react";
import styled from "styled-components";
import { useScrabbleState } from "../client-side/scrabble-state";
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

const PaddingTop = styled.div`
  padding-top: 0.5em;
`;

function BagInfo(): JSX.Element {
    const context = useScrabbleState();

    return <div>
        Tiles in bag: <span>{context.nTilesInBag}</span>
    </div>;
}

const DefinitionText = styled.div`
  margin-top: 0.2em;
  font-style: italic;
  max-width: 26em;
`;

export function MainGameArea(): JSX.Element {
    const { reviewGameHistory } = useScrabbleState();
    const [definition, setDefinition] = useState<string | null>(null);
    return <Game>
        <ScoresEtc />
        <RackAndControls />
        <MainBoardDiv>
            <MainBoard />
        </MainBoardDiv>
        <SpaceBetween>
            <WordChecker setDefinition={setDefinition} />
            <BagInfo />
        </SpaceBetween>

        {definition && <DefinitionText>{definition}</DefinitionText>}


        {reviewGameHistory ? <RewindControls /> : <TurnControl />}
        <PaddingTop >
            <HighScoringWordsControls />
        </PaddingTop>
        <ScoreLine/>
    </Game>;
}
