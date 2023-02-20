import { PlayerID } from "boardgame.io";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { sAssert } from "../../../utils/assert";
import { ClientMoves } from "../game-control/moves";
import { PlayerData, ServerData } from "../game-control/server-data";

export type GameContext = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : GameContext {
    return useStandardBoardContext() as GameContext;
}

/* Conveniece function */
export function usePlayerData(owner: PlayerID) : PlayerData {
    const playerData = useGameContext().G.playerData[owner];
    sAssert(playerData);

    return playerData;
}
