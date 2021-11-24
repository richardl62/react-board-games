import React from "react";
import { boardIDs, SquareID } from "../actions";
import { GameProps } from "./game-props";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { BoarderedGrid } from "../../../game-support/boardered-grid";
import { SquareType } from "../config";
import { BoardSquare } from "./board-square";
import { sAssert } from "../../../shared/assert";
import { Tile } from "./tile";
import { makeCoreTile } from "../actions/core-tile";
interface RackProps extends GameProps {
    selected: boolean[] | null;
    setSelected: (arg: boolean[]) => void;
}

export function Rack(props: RackProps): JSX.Element {
    const { selected, setSelected } = props;

    const coreTiles = props.rack;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            props.dispatch({
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
        
        const content = tile && <Tile tile={makeCoreTile(tile)} />;

        let onClick;
        if(selected) {
            onClick = () => toggleSelect(index); 
        } else if (props.clickMoveStart && props.rack[index]) {
            onClick = () => props.dispatch({
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
