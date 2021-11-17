import { BoarderedGrid } from "game-support/boardered-grid";
import React from "react";
import { Actions, boardIDs } from "../actions";
import { SquareID } from "../actions/actions";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { TileHolder } from "./tile-holder";

interface MainBoardProps {
    actions: Actions;
}

export function MainBoard({ actions }: MainBoardProps): JSX.Element {
    const tiles = actions.board;

    const nRows = tiles.length;
    const nCols = tiles[0].length;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            actions.dispatch({
                type: "move",
                data: {from: drag, to: drop}
            });
        }
    };

    // const draggableFunc = (row: number, col: number) => {
    //     return () => {
    //         const tile = actions.board[row][col];
    //         if (tile) {
    //             if (tile.active) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         } else {
    //             if (row === 0 && col === 2) {
    //                 return true; // SHOULD BE FALSE.
    //             } else {
    //                 return true; // SHOULD BE FALSE.
    //             }
    //         }
    //     };
    // };
    
    const elems = [];
    for(let row = 0; row < nRows; ++row) {
        for(let col = 0; col < nCols; ++col) {
            const tile = actions.board[row][col];
            const active = Boolean(tile?.active);

            elems.push(
                <TileHolder
                    key={[row,col].toString()}

                    tile={tile}
                    squareType={actions.config.boardLayout[row][col]}

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
