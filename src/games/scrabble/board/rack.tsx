import React from "react";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { BoarderedGrid } from "../../../utils/board/boardered-grid";
import { SquareType } from "../config";
import { BoardSquare } from "./board-square";
import { sAssert } from "../../../utils/assert";
import { Tile } from "./tile";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { SquareID, boardIDs } from "../client-side";
import { makeExtendedLetter } from "../client-side/extended-letter";

interface RackProps {
    selected: boolean[] | null;
    setSelected: (arg: boolean[]) => void;
}

export function Rack(props: RackProps): JSX.Element {
    const { selected, setSelected } = props;
    const context = useScrabbleContext();

    const coreTiles = context.rack;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            context.dispatch({
                type: "move",
                data: {from: drag, to: drop}
            });
        }
    };

    const toggleSelect = (index: number) => {
        sAssert(selected);
        const newSwappable = [...selected];
        newSwappable[index] = !newSwappable[index];
        setSelected(newSwappable);
    };

    const elems = coreTiles.map((tile, index) => {
        
        const content = tile && <Tile tile={makeExtendedLetter(tile)} />;

        let onClick;
        if(selected) {
            onClick = () => toggleSelect(index); 
        } else if (context.clickMoveStart && context.rack[index]) {
            onClick = () => context.dispatch({
                type: "clickMove", 
                data: {rackPos: index}
            });
        }

        return <BoardSquare
            key={index}

            content={content}
            squareType={SquareType.simple}

            squareID={{ row: 0, col: index, boardID: boardIDs.rack }}

            draggable={true}

            onDragEnd={selected ? undefined : onDragEnd}
            onClick={onClick}

            highlight={Boolean(selected && selected[index])}
            showHover={false}
        />;
    });

    return <BoarderedGrid
        nCols={coreTiles.length}
        backgroundColor={boardBoarderColor}
        gridGap={boardBoarderSize.internal}
        borderWidth={boardBoarderSize.external}
    >
        {elems}
    </BoarderedGrid>;
}
