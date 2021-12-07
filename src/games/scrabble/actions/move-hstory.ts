// Hmm. This could be improved by ensureing that exactly one of PlayedWordInfo,
// pass and swapTiles in set.

export interface PlayedWordsInfo {
    words: string[];
    score: number;
    
    illegalWords: string[];
}

export interface MoveHistoryElement extends Partial<PlayedWordsInfo> {
    name: string;

    pass?: true;
    nTilesSwapped?: number;
}
