import { BoarderedGrid } from "game-support/boardered-grid";
import React from "react";
import { boardIDs, SquareID } from "../actions";
import { GameProps } from "./game-props";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { TileHolder } from "./tile-holder";

interface MainBoardProps {
    xxx: GameProps;
}

export function MainBoard({ xxx }: MainBoardProps): JSX.Element {
    const tiles = xxx.localState.board;

    const nRows = tiles.length;
    const nCols = tiles[0].length;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            xxx.dispatch({
                type: "move",
                data: {from: drag, to: drop}
            });
        }
    };

    const elems = [];
    for(let row = 0; row < nRows; ++row) {
        for(let col = 0; col < nCols; ++col) {
            const tile = xxx.localState.board[row][col];
            const active = Boolean(tile?.active);

            elems.push(
                <TileHolder
                    key={[row,col].toString()}

                    tile={tile}
                    squareType={xxx.config.boardLayout[row][col]}

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
