import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ServerData } from "@game-control/games/cant-stop/server-data";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ClientMoves } from "@shared/game-control/games/cant-stop/moves/moves";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";
import { getScoringOptions } from "./scoring-options";

type StandardMatchState = WrappedMatchProps<ServerData, ClientMoves>;

interface MatchState extends StandardMatchState {

    fullColumns: number[];

    /** The indices of the columns that are in play.
      * 'In play' means that they have been selected after a previous roll during this
      * turn. Or, equivalently, they are the columns that count towards the limit
      * on the number of columns that can be in play during the turn. 
      */
    columnsInPlay: number[];

    scoringOptions: number[][];
}

export function useMatchState() : MatchState {
    const standardState = useStandardBoardContext() as StandardMatchState;
    const columnHeights = standardState.G.columnHeights;
    const playerID = standardState.playerID;
    
    const fullColumns = getFullColumns(columnHeights);
    
    const columnsInPlay = getColumnsInPlay(columnHeights[playerID]);
    
    const scoringOptions = getScoringOptions({
        diceValues: standardState.G.diceValues,
        fullColumns,
        columnsInPlay
    });
    
    return {
        ...standardState,
        fullColumns,
        columnsInPlay,
        scoringOptions, 
    }
}

function getFullColumns(heights: ServerData["columnHeights"]) : number[] {
    const result: number[] = [];
    for(const col of columnValues) {
        let full = false;
        
        for(const playerID in heights) {
            const playerHeights = heights[playerID];
            if (playerHeights[col].thisTurn === "full") {
                full = true;
            }
        }   
        if (full) {
            result.push(col);
        }
    }

    return result;
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