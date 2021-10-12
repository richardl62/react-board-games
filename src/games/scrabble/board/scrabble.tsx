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
import { useActions } from "../game-control";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";
import { ScrabbleConfig } from "../scrabble-config";
import { AppBoardProps } from "shared/app-board-props";
import { GameData } from "../game-data";

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
    appBoardProps: AppBoardProps<GameData>;
    config: ScrabbleConfig;
}  
export function ScrabbleBoard(props: ScrabbleBoardProps): JSX.Element {
    const actions = useActions(props.appBoardProps, props.config);
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
                    board={actions.board}
                    config={actions.config}
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

