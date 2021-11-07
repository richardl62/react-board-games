import { useEffect, useState } from "react";
import { sAssert } from "shared/assert";
import { Rack } from "./board-and-rack";
import { BoardData, GameData, isGameData } from "./game-data";
import { ScrabbleConfig } from "../config";
import { AppBoardProps } from "shared/app-board-props";
import { Actions } from "./actions";


export function useActions(props_: AppBoardProps, config: ScrabbleConfig): Actions {
    const props = props_ as AppBoardProps<GameData>;
    sAssert(isGameData(props.G));

    const playerID = props.playerID;
    sAssert(playerID); // KLUDGE? - Not sure when it can be null.

    const boardDefault = props.G.board;
    const rackDefault = props.G.playerData[playerID].playableTiles;

    const boardState = useState<BoardData>(boardDefault);
    const rackState = useState<Rack>(rackDefault);

    useEffect(() => {
        boardState[1](boardDefault);
        rackState[1](rackDefault);
    }, [boardDefault, rackDefault]);

    return new Actions(props, config, boardState, rackState);
}
