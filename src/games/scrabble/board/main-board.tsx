import React from "react";
import { Board, makeBoardProps, SquareInteractionFunc } from "game-support/deprecated/boards";
import { nestedArrayMap } from "shared/tools";
// KLUDGE? Should importing boardIDs be necessary?
import { Actions, boardIDs } from "../actions";
import { scrabbleSquareBackground, squareSize } from "./style";
import { Tile } from "./tile";

interface MainBoardProps {
    actions: Actions;
    squareInteraction: SquareInteractionFunc;
}

export function MainBoard({ actions, squareInteraction }: MainBoardProps): JSX.Element {

    const tiles = nestedArrayMap(actions.board, sd => {
        if (!sd) return null;
        const markAsMoveable = sd.active;
        return <Tile tile={sd} markAsMoveable={markAsMoveable} />;
    });

    const squareColors = nestedArrayMap(
        actions.config.boardLayout,
        scrabbleSquareBackground
    );

    const boardProps = makeBoardProps({
        pieces: tiles,

        squareBackground: sq => squareColors[sq.row][sq.col],
        externalBorders: true,
        internalBorders: true,
        squareSize: squareSize,

        boardID: boardIDs.main,
        squareInteraction: squareInteraction,
        moveStart: null, //clickDragState.start,
    });

    return <Board {...boardProps} />;
}
