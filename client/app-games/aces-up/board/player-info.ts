import { PlayerID } from "@game-control/playerid";
import { MatchState } from "../game-support/match-state";

export class PlayerInfo {

    constructor(context: MatchState, owner: PlayerID) {
        this.owner = owner;
        this.viewer = context.playerID;
        this.currentPlayer = context.ctx.currentPlayer;
    }

    /** The player who owns this data */
    readonly owner: PlayerID;

    /** The player who will view (parts of) the data */
    readonly viewer: PlayerID;

    /** This play whoses turn it is */
    readonly currentPlayer: PlayerID;
}
