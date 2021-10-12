export enum SquareType {
    doubleWord,
    tripleWord,
    doubleLetter,
    tripleLetter,
    simple,
}

export function multipliers(st: SquareType) : {letter: number, word: number}
{
    let letter;
    if(st === SquareType.tripleLetter) {
        letter = 3;
    } else if(st === SquareType.doubleLetter) {
        letter = 2;
    } else {
        letter = 1;
    }

    let word;
    if(st === SquareType.tripleWord) {
        word = 3;
    } else if(st === SquareType.doubleWord) {
        word = 2;
    } else {
        word = 1;
    }

    return {letter: letter, word: word};
}




