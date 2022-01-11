import { BoarderedGrid } from "../../../game-support/boardered-grid";
import React from "react";
import { boardIDs, SquareID } from "../local-actions";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { BoardSquare } from "./board-square";
import { Tile } from "./tile";
import { ClickMoveMarker } from "./click-move-marker";
import { useScrabbleContext } from "./scrabble-context";

export function MainBoard(): JSX.Element {
    const { board, clickMoveStart, config, dispatch } = useScrabbleContext();
    const nRows = board.length;
    const nCols = board[0].length;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            dispatch({
                type: "move",
                data: {from: drag, to: drop}
            });
        }
    };

    const elems = [];
    for(let row = 0; row < nRows; ++row) {
        for(let col = 0; col < nCols; ++col) {
            const tile = board[row][col];
            const active = Boolean(tile?.active);

            let content = null;
            let onClick;
            if ( tile ) {
                content = <Tile tile={tile} />;
            } else {
                onClick = () => dispatch({
                    type: "setClickMoveStart",
                    data: {row: row, col: col}
                });

                if (clickMoveStart?.row === row && clickMoveStart?.col === col) {
                    content = <ClickMoveMarker direction={clickMoveStart.direction} />;
                }
            }

            elems.push(
                <BoardSquare
                    key={[row,col].toString()}

                    content={content}
                    squareType={config.boardLayout[row][col]}

                    draggable={active}

                    squareID={{row:row, col:col, boardID: boardIDs.main}}

                    onClick={onClick}
                    onDragEnd={onDragEnd} 

                    highlight={active}
                    showHover={true}
                />
            );
        }
    } 

    return <BoarderedGrid
        nCols={nCols}
        backgroundColor={boardBoarderColor}
        gridGap={boardBoarderSize.internal}
        borderWidth={boardBoarderSize.external}
    >
        {elems}
    </BoarderedGrid>;
}
