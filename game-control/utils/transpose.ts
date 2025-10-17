/** Return a the transpose of a 2-D array.  The input array is assumed
 * to be reactangular (i.e. all rows have the same lenght.)
 */
export function transpose<T>(grid: T[][]) : T[][] {
    const nRows = grid.length;
    const nCols = grid[0].length;

    const trans: T[][] = [];

    for(let c = 0; c < nCols; ++c) {
        trans[c] = [];
        for(let r = 0; r < nRows; ++r) {
            trans[c][r] = grid[r][c];
        }
    }

    return trans;
} 