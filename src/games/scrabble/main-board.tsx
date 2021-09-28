import React from "react";
import { Board, makeBoardProps, SquareInteractionFunc } from "boards";
import { nestedArrayMap } from "shared/tools";
import { boardIDs } from "./game-actions";
import { ScrabbleConfig } from "./scrabble-config";
import { scrabbleSquareBackground, squareSize } from "./style";
import { Tile } from "./tile";
import { BoardData } from "./game-data";

interface MainBoardProps {
  squareInteraction: SquareInteractionFunc;
  board: BoardData;
  config: ScrabbleConfig;
}



export function MainBoard({ board, squareInteraction, config }: MainBoardProps): JSX.Element {

    const tiles = nestedArrayMap(board, sd => {
        if (!sd) return null;
        const markAsMoveable = sd.active;
        return <Tile tile={sd} markAsMoveable={markAsMoveable} />;
    });

    const squareColors = nestedArrayMap(
        config.boardLayout,
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
