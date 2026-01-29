import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { BoardProps } from "../../../app-game-support/board-props";
import { PlayerData, ServerData } from "@game-control/games/aces-up/server-data";
import { ClientMoves } from "@game-control/games/aces-up/moves/moves";
import { PlayerID } from "@game-control/playerid";
import { sAssert } from "@utils/assert";

interface ExtendedServerData extends ServerData {
    getPlayerData: (owner: PlayerID) => PlayerData;
}

export interface MatchState extends BoardProps<ServerData, ClientMoves>  {
    G: ExtendedServerData;
}
export function useMatchState() : MatchState {
    const ctx = useStandardBoardContext() as BoardProps<ServerData, ClientMoves>;

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
