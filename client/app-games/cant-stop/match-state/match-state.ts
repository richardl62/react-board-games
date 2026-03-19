import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { BoardProps } from "@/app-game-support/board-props";
import { ServerData } from "@game-control/games/cant-stop/server-data";
import { ClientMoves } from "@shared/game-control/games/cant-stop/moves/moves";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";
import { blockedColumns, isBlocked, IsBlockedArg0 } from "./is-blocked";
import { sanityCheckColumnHeights } from "./sanity-checks";
import { PlayerID } from "@shared/game-control/playerid";
import { isFull } from "@shared/game-control/games/cant-stop/tools/is-full";

type StandardMatchState = BoardProps<ServerData, ClientMoves>;

export interface MatchState extends StandardMatchState {

    /* Squares on which the 'mean rules' options prevent a given player from stopping. 
    * Full columns do not count as blocked as the fullness rules are not part of the 'mean rules'.
    */
    isBlocked: (
        {playerID, column, height}: IsBlockedArg0
    ) => boolean;

    isFull: (col: number, category:keyof ColumnHeight) => PlayerID | undefined;

    /** The columns on which the active player in actively blocked, i.e. must either advance 
    * further or go bust. 
    */
    currentlyBlockedColumns: number[];
}

export function useMatchState() : MatchState {
    const standardState = useStandardBoardContext() as StandardMatchState;
    const columnHeights = standardState.G.columnHeights;
    const playerID = standardState.playerID;
    
    // Is this the best place for this check?
    sanityCheckColumnHeights(columnHeights);

    const isBlockedSimplified = (arg: IsBlockedArg0) => isBlocked(arg, columnHeights, standardState.G.options)
    const isFullSimplified = (col: number, category: keyof ColumnHeight) => isFull(col, category, columnHeights);
    
    const state : MatchState = {
        ...standardState,
        isBlocked: isBlockedSimplified,
        isFull: isFullSimplified,
        currentlyBlockedColumns: blockedColumns(
            columnHeights,
            playerID,
            isBlockedSimplified,
        ),
    };

    return state;
}

