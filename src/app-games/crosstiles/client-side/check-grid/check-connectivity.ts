import { sAssert } from "../../../../utils/assert";

interface RowCol {
    row: number;
    col: number;
}


/** Return an array indicating which elements in 'grid' are connect to 'start' */
function connectedElements<T>(grid: T[][], start: RowCol) : boolean [][] {
    const connected: boolean[][] = [];
    for(let row = 0; row < grid.length; ++row) {
        connected[row] = [];
        for(let col = 0; col < grid[row].length; ++col) {
            connected[row][col] = false;
        }
    }

    const toFollow = [start];

    /* Add {row,col} to 'toFollow' if it is in the grid and has not already
     * been followed (i.e. is not already in 'connected').
     */
    const candidateToFollow = (row: number, col: number) => {
        if(grid[row] && grid[row][col] && !connected[row][col]) {
            toFollow.push({row, col});
        }
    };
    
    while(toFollow.length > 0) {
        const {row, col} = toFollow.pop()!;
        connected[row][col] = true;

        candidateToFollow(row-1,col);
        candidateToFollow(row+1,col);
        candidateToFollow(row,col-1);
        candidateToFollow(row,col+1);
    }

    return connected;
}

/** Check if all the truthy elements of the grid and connected. Connections can be
 * horizontal or vertical.
 */ 
export function checkConnectivity<T>(grid: T[][]) : "connected" | "disconnected" | "empty" {
    
    let connected;
    for(let row = 0; row < grid.length; ++row) {
        for(let col = 0; col < grid[row].length; ++col) {
            if(grid[row][col]) {
                if(!connected) {
                    connected = connectedElements(grid, {row,col});
                } else if(!connected[row][col]) {
                    return "disconnected";
                }
            }
        }
    }

    return connected ? "connected" : "empty";
}
/* eslint-disable no-sparse-arrays */
const empty = [
    [ , , ],
    [ , , ],
];

const connected = [
    [1,1, ],
    [ ,1,1],
];

const disconnected = [
    [1,1, , ],
    [ ,1,1, ],
    [ , , ,1],
];

sAssert(checkConnectivity(empty) === "empty");
sAssert(checkConnectivity(connected) === "connected");
sAssert(checkConnectivity(disconnected) === "disconnected");

