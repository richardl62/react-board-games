// Hmm. This could be improved by ensureing that exactly one of PlayedWordInfo,
// pass and swapTiles in set.

export interface WordsPlayedInfo {
  pid: string;

  // Letters that where previously on the board are lowercase.
  displayWords: string[];

  score: number;

  illegalWords: string[];
}

export interface MoveHistoryElement {
  wordsPlayed?: WordsPlayedInfo;

  pass?: { pid: string };

  tilesSwapped?: {
    pid: string;
    nSwapped: number;
  };

  scoresAdjusted?: Record<string, number>;

  gameOver?: { winners: string[] }; // id of winner(s);

  errorInLastAction?: { message: string };
}
