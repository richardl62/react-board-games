import { SquareID } from "game-support/deprecated/boards";
import { useState } from "react";
import { Letter } from "./letters";
import { ScrabbleData, getWordsAndScore, findActiveLetters } from "./game-control";


function sameWordList(words1: string[], words2: string[]) : boolean {
    return words1.join() === words2.join();
}

export interface TurnControlData {
  score?: number | "-";
  illegalWords?: string[];
  onPass?: (() => void);

  onSetBlank?: () => void;
  doSetBlank?: (arg: Letter) => void;

  onDone?: () => void;
}


export function useTurnControlData(scrabbleData: ScrabbleData): TurnControlData {
  interface IllegalWordsData {
    illegal: string[]; // Words to report
    all: string[]; // All words at time illegal words were recorded.
  }
  const [illegalWordsData, setIllegalWordsData] = useState<IllegalWordsData|null>(null);
  const [blankToSet, setBlankToSet] = useState<SquareID|null>(null);

  const active = findActiveLetters(scrabbleData);
  const wordsAndScore = getWordsAndScore(scrabbleData, active);
  const unsetBlank = scrabbleData.getUnsetBlack();

  if(illegalWordsData) {
      // Clear the illegalWord
      if(!wordsAndScore || !sameWordList(illegalWordsData.all, wordsAndScore.words)) {
          setIllegalWordsData(null);
      } 
  }

  if (active.length === 0 && scrabbleData.isMyTurn) {
      return {
          onPass: () => scrabbleData.endTurn(0),
      };
  } else if (!wordsAndScore) {
      return {
          score: "-",
      };
  } else {
    
      const { score, words, illegalWords } = wordsAndScore;


      const result: TurnControlData = {};

      result.score = score;

      if(illegalWordsData) {
          result.illegalWords = illegalWordsData.illegal;
      } 

      if(unsetBlank) {
          result.onSetBlank = () => setBlankToSet(unsetBlank); 
      }

      if(blankToSet) {
          result.doSetBlank = (l: Letter) => {
              scrabbleData.setBlank(blankToSet, l);
              setBlankToSet(null);
          };
      }

      if(scrabbleData.isMyTurn && !unsetBlank) {
          const uncheckedDone = () => {
              scrabbleData.endTurn(score);
              setIllegalWordsData(null);
          };

          const checkedDone = () => {
              if (!illegalWords) {
                  uncheckedDone();
              } else {
                  setIllegalWordsData({all: words, illegal: illegalWords});
              }
          };

          result.onDone = illegalWordsData ? uncheckedDone : checkedDone;
      }

      return result;
  }
}

