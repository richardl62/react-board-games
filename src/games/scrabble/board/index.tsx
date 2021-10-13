import { DndProvider } from "game-support/drag-drop";
import { WaitingForPlayers } from "game-support/waiting-for-players";
import React from "react";
import styled from "styled-components";
import { Actions } from "../actions";
import { MainBoard } from "./main-board";
import { RackEtc } from "./rack";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between
`;

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

interface ScrabbleBoardProps {
    actions: Actions;
}  
export function Board({actions}: ScrabbleBoardProps): JSX.Element {

    if(!actions.allJoined) {
        <WaitingForPlayers {...actions.getProps()} />;
    }

    return (
        <DndProvider>
            <Game>
                <ScoresEtc actions={actions} />
                <RackEtc actions={actions} />
                <MainBoard actions={actions} />
                <SpaceBetween>
                    <WordChecker/>
                    <div>
                        Tiles in bag: <span>{actions.nTilesInBag}</span>
                    </div>
                </SpaceBetween>

                <TurnControl actions={actions}/>
            </Game>
        </DndProvider>
    );
}

