import { DndProvider } from "game-support/drag-drop";
import { WaitingForPlayers } from "game-support/waiting-for-players";
import React from "react";
import styled from "styled-components";
import { Actions } from "../actions";
import { MainBoard } from "./main-board";
import { RankAndControls } from "./rack-and-controls";
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
    actions: Actions;
} 

export function BagInfo({actions}: ScrabbleBoardProps): JSX.Element {
    return <div>
        Tiles in bag: <span>{actions.nTilesInBag}</span>
    </div>;
}

export function Board({actions}: ScrabbleBoardProps): JSX.Element {

    if(!actions.allJoined) {
        <WaitingForPlayers {...actions.getProps()} />;
    }

    return (
        <DndProvider>
            <Game>
                <ScoresEtc actions={actions} />
                <RankAndControls actions={actions} />
                <Centered>
                    <MainBoard actions={actions} />
                </Centered>
                <SpaceBetween>
                    <WordChecker/>
                    <BagInfo actions={actions} />
                </SpaceBetween>

                <TurnControl actions={actions}/>
            </Game>
        </DndProvider>
    );
}

