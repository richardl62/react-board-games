// Hmm. This could be improved by ensureing that exactly one of PlayedWordInfo,
// pass and swapTiles in set.

export interface WordsPlayedInfo {
    pid: string;

    words: string[];
    score: number;
    
    illegalWords: string[];
}

export interface MoveHistoryElement {
    wordsPlayed?: WordsPlayedInfo;

    pass?: {pid: string};

    tilesSwapped?: {
        pid: string;
        nSwapped: number;
    };
    
    scoresAdjusted?: {[id: string]: number};

    gameOver?: {winners: string[]}; // id of winner(s);

    moveError?: {message: string};
}
