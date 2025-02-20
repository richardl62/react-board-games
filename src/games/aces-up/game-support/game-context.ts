import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { PlayerData, ServerData } from "../game-control/server-data";
import { ClientMoves } from "../game-control/moves";
import { PlayerID } from "../../../boardgame-lib/playerid";
import { sAssert } from "../../../utils/assert";

interface ExtendedServerData extends ServerData {
    getPlayerData: (owner: PlayerID) => PlayerData;
}

export interface GameContext extends WrappedGameProps<ServerData, ClientMoves>  {
    G: ExtendedServerData;
}
export function useGameContext() : GameContext {
    const ctx = useStandardBoardContext() as WrappedGameProps<ServerData, ClientMoves>;

    const getPlayerData = (owner: PlayerID) => {
        const playerData = ctx.G.playerData[owner];
        sAssert(playerData);
        return playerData;
    };

    return {
        ...ctx,
        G: {...ctx.G, getPlayerData},
    };
}
