import React from "react";
import styled from "styled-components";
import { DndProvider } from "../../../game-support/drag-drop";
import { GameProps } from "./game-props";
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

export function BagInfo(props: GameProps): JSX.Element {
    return <div>
        Tiles in bag: <span>{props.bag.length}</span>
    </div>;
}

export function MainGameArea(props: GameProps): JSX.Element {
    return <DndProvider>
        <Game>
            <ScoresEtc {...props} />
            <RackAndControls {...props} />
            <Centered>
                <MainBoard {...props} />
            </Centered>
            <SpaceBetween>
                <WordChecker />
                <BagInfo {...props} />
            </SpaceBetween>

            <TurnControl {...props} />
        </Game>
    </DndProvider>;
}
