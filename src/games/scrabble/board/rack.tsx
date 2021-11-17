import React from "react";
import { boardIDs, SquareID } from "../actions";
import { ActionsXXX } from "./actions-xxx";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { BoarderedGrid } from "game-support/boardered-grid";
import { SquareType } from "../config";
import { TileHolder } from "./tile-holder";
import { sAssert } from "shared/assert";
interface RackProps {
    actions: ActionsXXX;
    selected: boolean[] | null;
    setSelected: (arg: boolean[]) => void;
}

export function Rack(props: RackProps): JSX.Element {
    const { actions, selected, setSelected } = props;

    const coreTiles = props.actions.localState.rack;

    const onDragEnd = ({drag, drop}: {drag: SquareID, drop: SquareID | null}) => {
        if(drop) {
            actions.dispatch({
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

    const elems = coreTiles.map((tile, index) => <TileHolder
        key={index}

        tile={tile}
        squareType={SquareType.simple}

        squareID={{ row: 0, col: index, boardID: boardIDs.rack }}

        draggable={true}

        onDragEnd={selected ? undefined : onDragEnd}
        onClick={selected? ()=>toggleSelect(index) : undefined}

        highlight={Boolean(selected && selected[index])}
        showHover={false}
    />);

    return <BoarderedGrid
        nCols={coreTiles.length}
        backgroundColor={boardBoarderColor}
        gridGap={boardBoarderSize.internal}
        borderWidth={boardBoarderSize.external}
    >
        {elems}
    </BoarderedGrid>;
}
