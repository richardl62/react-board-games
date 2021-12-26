import React from "react";
import styled from "styled-components";
import { DndProvider } from "../../../game-support/drag-drop";
import { useScrabbleContext } from "../scrabble-context";
import { MainBoard } from "./main-board";
import { RackAndControls } from "./rack-and-controls";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";


export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
`;

export const Centered = styled.div`
  display: flex;
  align-self: center;
`;

export const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

export function BagInfo(): JSX.Element {
    const context = useScrabbleContext();

    return <div>
        Tiles in bag: <span>{context.bag.length}</span>
    </div>;
}

export function MainGameArea(): JSX.Element {
    return <DndProvider>
        <Game>
            <ScoresEtc/>
            <RackAndControls/>
            <Centered>
                <MainBoard/>
            </Centered>
            <SpaceBetween>
                <WordChecker />
                <BagInfo/>
            </SpaceBetween>

            <TurnControl/>
        </Game>
    </DndProvider>;
}
