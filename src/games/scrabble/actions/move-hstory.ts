// Hmm. This could be improved by ensureing that exactly one of PlayedWordInfo,
// pass and swapTiles in set.

export interface WordsPlayedInfo {
    words: string[];
    score: number;
    
    illegalWords: string[];
}

export interface MoveHistoryElement {
    name: string;

    wordsPlayed?: WordsPlayedInfo;
    pass?: true;
    nTilesSwapped?: number;
    scoreAdjustment?: {[id: string]: number};
}
