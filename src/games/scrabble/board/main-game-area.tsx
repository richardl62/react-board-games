import React from "react";
import styled from "styled-components";
import { DndProvider } from "../../../utils/board/drag-drop";
import { useScrabbleContext } from "../client-side-actions/scrabble-context";
import { MainBoard } from "./main-board";
import { RackAndControls } from "./rack-and-controls";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";
import { EnableMoveHistoryToggle } from "./move-history";
import { RewindControls } from "./rewind-controls";
import { ErrorMessage } from "../../../utils/error-message";



const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
`;

const Centered = styled.div`
  display: flex;
  align-self: center;
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
    const { reviewGameHistory, winnerIds, serverError } = useScrabbleContext();
    return <DndProvider>
        <Game>
            <ErrorMessage category={"server error"} message={serverError}/>
            <ScoresEtc/>
            <RackAndControls/>
            <Centered>
                <MainBoard/>
            </Centered>
            <SpaceBetween>
                <WordChecker />
                <BagInfo/>
            </SpaceBetween>

            {reviewGameHistory ? <RewindControls/> : <TurnControl/> }
            { winnerIds && <EnableMoveHistoryToggle/>}
        </Game>
    </DndProvider>;
}
