import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { BoardProps } from "@/app-game-support/board-props";
import { ServerData } from "@game-control/games/cant-stop/server-data";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ClientMoves } from "@shared/game-control/games/cant-stop/moves/moves";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";
import { getScoringOptions } from "./scoring-options";
import { blockedColumns, isBlocked, IsBlockedArg0 } from "./is-blocked";
import { sanityCheckColumnHeights } from "./sanity-checks";
import { PlayerID } from "@shared/game-control/playerid";

type StandardMatchState = BoardProps<ServerData, ClientMoves>;

export interface MatchState extends StandardMatchState {

    /** The indices of the columns that are in play.
      * 'In play' means that they have been selected after a previous roll during this
      * turn. Or, equivalently, they are the columns that count towards the limit
      * on the number of columns that can be in play during the turn. 
      */
    columnsInPlay: number[];

    scoringOptions: number[][];

    /* Squares on which the 'mean rules' options prevent a given player from stopping. 
    * Full columns do not count as blocked as the fullness rules are not part of the 'mean rules'.
    */
    isBlocked: (
        {playerID, column, height}: IsBlockedArg0
    ) => boolean;

    isFull: (col: number) => PlayerID | undefined;

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

    
    const columnsInPlay = getColumnsInPlay(columnHeights[playerID]);

    const isBlockedSimplified = (arg: IsBlockedArg0) => isBlocked(arg, columnHeights, standardState.G.options)
    const isFullSimplified = (col: number) => isFull(col, columnHeights);

    
    const scoringOptions = getScoringOptions({
        diceValues: standardState.G.diceValues,
        isFull: isFullSimplified,
        columnsInPlay
    });
    
    const state : MatchState = {
        ...standardState,
        columnsInPlay,
        scoringOptions, 
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

function isFull(col: number, heights: ServerData["columnHeights"]) : PlayerID | undefined {
    for (const [playerID, playerHeights] of Object.entries(heights)) {
        if (playerHeights[col].thisTurn === "full") {
            return playerID;
        }
    }

    return undefined;
}

function getColumnsInPlay(heights: ColumnHeight[]) : number[] {
    const inPlay: number[] = [];
    for (const col of columnValues) {
        if (heights[col].owned !== heights[col].thisTurn) {
            inPlay.push(col);
        }
    }

    return inPlay;
}