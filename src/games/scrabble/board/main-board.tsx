import { BoarderedGrid } from "game-support/boardered-grid";
import React from "react";
import { boardIDs, SquareID } from "../actions";
import { GameProps } from "./game-props";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { BoardSquare } from "./board-square";
import { Tile } from "./tile";
import { match } from "assert";
import { ClickMoveMarker } from "./click-move-marker";

export function MainBoard(props: GameProps): JSX.Element {
    const { board, clickMoveStart } = props;
    const nRows = board.length;
    const nCols = board[0].length;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            props.dispatch({
                type: "move",
                data: {from: drag, to: drop}
            });
        }
    };

    const elems = [];
    for(let row = 0; row < nRows; ++row) {
        for(let col = 0; col < nCols; ++col) {
            const tile = props.board[row][col];
            const active = Boolean(tile?.active);

            let content = null;
            if ( tile ) {
                content = <Tile tile={tile} />;
            } else if (clickMoveStart?.row === row && clickMoveStart?.col === col) {
                content = <ClickMoveMarker direction={clickMoveStart.direction} />;
            }

            elems.push(
                <BoardSquare
                    key={[row,col].toString()}

                    content={content}
                    squareType={props.config.boardLayout[row][col]}

                    draggable={active}

                    squareID={{row:row, col:col, boardID: boardIDs.main}}
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
