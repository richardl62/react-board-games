// Hmm. This could be improved by ensureing that exactly one of PlayedWordInfo,
// pass and swapTiles in set.

export interface WordsPlayedInfo {
    player: string;

    words: string[];
    score: number;
    
    illegalWords: string[];
}

export interface MoveHistoryElement {
    wordsPlayed?: WordsPlayedInfo;

    pass?: {player: string};

    tilesSwapped?: {
        player: string;
        nSwapped: number;
    };
}
