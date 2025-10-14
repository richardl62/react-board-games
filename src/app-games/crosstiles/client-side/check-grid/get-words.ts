import { Letter } from "../../config";
import { transpose } from "../../../../utils/transpose";

function addWordsfromRow(row: (Letter | null)[], words: string[]) {
    let str = "";
    for(let r = 0; r < row.length+1; r++) { // Reads one off end of row
        const letter = row[r];
        if(letter) {
            str += letter;
        } else {
            if(str.length >= 2) {
                words.push(str);
            }
            str = "";
        }
    }
}

export function getWords(grid: (Letter|null)[][]) : string[] {
    const words: string[] = [];
    for(const row in grid) {
        addWordsfromRow(grid[row], words);
    }

    const trans = transpose(grid);
    for(const row in trans) {
        addWordsfromRow(trans[row], words);
    }

    return words;
}

// const grid1 = [
//     [1,2,3],
//     [4,5,6]
// ];
// console.log(transpose(grid1));

// const grid2 : (Letter|null)[][] = [
//     ["C","A","T",null,"S","A","T"],
//     [null,"O","N",null,"A",null,"M","A","T",null]
// ];
// console.log(getWords(grid2));