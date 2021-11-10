import { useEffect, useState } from "react";
import { sAssert } from "shared/assert";
import { Rack } from "./board-and-rack";
import { BoardData, GameData, isGameData } from "./game-data";
import { ScrabbleConfig } from "../config";
import { GeneralGameProps } from "shared/general-game-props";
import { Actions, PlayerGameState } from "./actions";

// Hmm. Should this be refactored to use useReduce?
export function useActions(props_: GeneralGameProps, config: ScrabbleConfig): Actions {
    const props = props_ as GeneralGameProps<GameData>;
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

    const state = {
        board: boardState[0],
        rack: rackState[0],
    };

    const setState = (state: PlayerGameState) => {
        boardState[1](state.board);
        rackState[1](state.rack);
    };

    return new Actions(props, config, state, setState);
}
