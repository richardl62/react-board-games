import { PlayerID } from "../../../boardgame-lib/playerid";
import { GameContext } from "../game-support/game-context";

export class PlayerInfo {

    constructor(context: GameContext, owner: PlayerID) {
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
