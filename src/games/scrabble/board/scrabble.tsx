import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useErrorHandler } from "react-error-boundary";
import styled from "styled-components";
import { DragType, SquareID, squareInteractionFunc } from "game-support/deprecated/boards";
import { WaitingForPlayers } from "game-support/waiting-for-players";
import { sAssert } from "shared/assert";
import { MainBoard } from "./main-board";
import { RackEtc } from "./rack";
import { ScoresEtc } from "./scores-etc";
import { Actions } from "../game-control";
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
export function ScrabbleBoard({actions}: ScrabbleBoardProps): JSX.Element {

    const handleError = useErrorHandler();

    const moveFunctions = {

        onMoveEnd: (from: SquareID, to: SquareID | null)=> {
            if (to) {
                try {
                    actions.move({from: from, to: to});
                } catch(error) {
                    handleError(error);
                }
            }
        },

        dragType: (sq: SquareID) => actions.canMove(sq) ? DragType.move : DragType.disable,
    };

    const squareInteraction = squareInteractionFunc(moveFunctions);

    if(!actions.allJoined) {
        <WaitingForPlayers {...actions.getProps()} />;
    }

    const allowSwapping = actions.nTilesInBag >= actions.config.rackSize;
    const doSwapTiles = (toSwap: boolean[]) => {
        sAssert(allowSwapping);
        actions.swapTiles(toSwap);
        actions.endTurn(0);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Game>
                <ScoresEtc actions={actions} />
                <RackEtc
                    squareInteraction={squareInteraction}
                    rack={actions.rack}
                    swapTiles={allowSwapping ? doSwapTiles : undefined}
                    actions={actions}
                />
                <MainBoard
                    squareInteraction={squareInteraction}
                    actions={actions}
                />
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

