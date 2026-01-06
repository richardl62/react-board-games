import { ColumnHeight, ServerData } from "@shared/game-control/games/cant-stop/server-data";
import { columnValues, maxColumnHeight } from "@shared/game-control/games/cant-stop/config";

function isNonDecreasing(nums: number[]) {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) return false;
  }
  return true;
}

function sanityCheckHeight(col: number, height: ColumnHeight) {
    const maxHeight = maxColumnHeight(col); 
    
    const xHeight = (height: number | "full") : number => {
        if (height === "full") return maxHeight;
        
        if (height < 0 || height >= maxHeight) {
            throw new Error(
                `Sanity check failed for column height value ${height} on column ${col}`
            );
        }
        return height;
    }

    const { owned, thisTurn, thisScoringChoice } = height;
    if (!isNonDecreasing([xHeight(owned), xHeight(thisTurn), xHeight(thisScoringChoice)])) {
        throw new Error(
            `Sanity check failed for column heights - owned:${owned} thisTurn:${thisTurn} ` +
            `thisScoringChoice:${thisScoringChoice} on column ${col}`
        );
    }
}

export function sanityCheckColumnHeights(columnHeights: ServerData["columnHeights"]) {
    for ( const playerID of Object.keys(columnHeights)) {
        for( const col of columnValues) {
            sanityCheckHeight(col, columnHeights[playerID][col]);
        }
    }
}