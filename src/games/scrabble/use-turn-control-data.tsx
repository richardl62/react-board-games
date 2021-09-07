import { allLetterBonus } from "./scrabble-config";
import { findActiveLetters, findCandidateWords, RowCol } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { scoreWords } from "./score-word";
import { ScrabbleData } from "./scrabble-data";
import { isLegalWord } from "./is-legal-word"
import { useState } from "react";

function sameWordList(words1: string[], words2: string[]) : boolean {
  return words1.join() === words2.join();
}

interface WordsAndScore {
  words: string[];
  /** For later convenience, use null rather than an empty array */
  illegalWords: string[] | null;
  score: number;
}


function getWordsAndScore(scrabbleData: ScrabbleData, active: RowCol[]): WordsAndScore | null {
  const candidateWords = findCandidateWords(scrabbleData.board, active);

  if (!candidateWords) {
    return null;
  }

  const words = candidateWords.map(cw => getWord(scrabbleData.board, cw))
  
  let illegalWords : string[] | null = words.filter(wd => !isLegalWord(wd));
  if(illegalWords.length === 0) {
    illegalWords = null;
  }

  let score = scoreWords(scrabbleData.board, candidateWords, scrabbleData.config);
  if (active.length === scrabbleData.config.rackSize) {
    score += allLetterBonus;
  }

  return {
    words: words,
    illegalWords: illegalWords,
    score: score,
  }
}

export interface TurnControlData {
  score?: number | '-';
  illegalWords?: string[];
  onSetBlank?: (() => void);
  onDone?: (() => void);
  onPass?: (() => void);
}


export function useTurnControlData(scrabbleData: ScrabbleData): TurnControlData {
  interface IllegalWordState {
    illegal: string[]; // Words to report
    all: string[]; // All words at time illegal words were recorded.
  }
  const [illegalWordsState, setIllegalWordsState] = useState<IllegalWordState|null>(null);

  const active = findActiveLetters(scrabbleData.board);
  const wordsAndScore = getWordsAndScore(scrabbleData, active);

  if(illegalWordsState) {
    // Clear the illegalWord
    if(!wordsAndScore || !sameWordList(illegalWordsState.all, wordsAndScore.words)) {
      setIllegalWordsState(null);
    } 
  }

  if (active.length === 0 && scrabbleData.isMyTurn) {
    return {
      onPass: () => scrabbleData.endTurn(0),
    }
  } else if (!wordsAndScore) {
    return {
      score: '-',
    }
  } else {
    const { score, words, illegalWords } = wordsAndScore;

    const uncheckedDone = () => {
      scrabbleData.endTurn(score);
      setIllegalWordsState(null);
    }

    const checkedDone = () => {

      if (!illegalWords) {
        uncheckedDone();
      } else {
        setIllegalWordsState({all: words, illegal: illegalWords});
      }
    }

    if (illegalWordsState) {
      return {
        score: wordsAndScore.score,
        illegalWords: illegalWordsState.illegal,
        onDone: scrabbleData.isMyTurn ? uncheckedDone : undefined,
      }
    } else {
      return {
        score: score,
        onDone: scrabbleData.isMyTurn ? checkedDone : undefined,
      }
    }
  }
}

