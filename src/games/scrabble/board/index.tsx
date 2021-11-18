import { DndProvider } from "game-support/drag-drop";
import { WaitingForPlayers } from "game-support/waiting-for-players";
import React from "react";
import styled from "styled-components";
import { GameProps } from "./game-props";
import { MainBoard } from "./main-board";
import { RackAndControls } from "./rack-and-controls";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";

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

interface ScrabbleBoardProps {
    xxx: GameProps;
} 

export function BagInfo({xxx}: ScrabbleBoardProps): JSX.Element {
    return <div>
        Tiles in bag: <span>{xxx.localState.bag.length}</span>
    </div>;
}

export function Board({xxx}: ScrabbleBoardProps): JSX.Element {

    if(!xxx.bgioProps.allJoined) {
        <WaitingForPlayers {...xxx.bgioProps} />;
    }

    return (
        <DndProvider>
            <Game>
                <ScoresEtc xxx={xxx} />
                <RackAndControls xxx={xxx} />
                <Centered>
                    <MainBoard xxx={xxx} />
                </Centered>
                <SpaceBetween>
                    <WordChecker/>
                    <BagInfo xxx={xxx} />
                </SpaceBetween>

                <TurnControl xxx={xxx}/>
            </Game>
        </DndProvider>
    );
}

