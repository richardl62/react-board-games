import { PlayerConnectionStatus } from "./player-status";
import { ConnectionStatus } from "@/app/match-play/online/use-server-connection";
import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { PlayerID } from "@shared/game-control/playerid";

export type UntypedMoves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: (...args: any[]) => void;
};

//To do: Consider given this a better name.
export interface WrappedMatchProps<
    TypeG=unknown, 
    Moves extends UntypedMoves=UntypedMoves
> {
    playerID: PlayerID;
    
    G: TypeG;

    ctx: Ctx;

    moves: Moves;

    events: EventsAPI;

    errorInLastAction: string | null;

    connectionStatus: ConnectionStatus;

    getPlayerConnectionStatus: (pid: string) => PlayerConnectionStatus;

    getPlayerName: (pid: string) => string;

    allJoined: boolean;
}
