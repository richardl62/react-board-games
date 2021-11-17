import { useState } from "react";
import { Letter } from "../config";
import { Actions, getWordsAndScore, findActiveLetters, SquareID } from "../actions";
import { endTurn } from "../actions/bgio-moves";
import { findUnsetBlack } from "../actions/board-and-rack";

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

export function useTurnControlData(actions: Actions): TurnControlData {
  interface IllegalWordsData {
    illegal: string[]; // Words to report
    all: string[]; // All words at time illegal words were recorded.
  }
  const [illegalWordsData, setIllegalWordsData] = useState<IllegalWordsData|null>(null);
  const [blankToSet, setBlankToSet] = useState<SquareID|null>(null);

  const active = findActiveLetters(actions.localState);
  const wordsAndScore = getWordsAndScore(actions.localState, actions.config, active);
  const unsetBlank = findUnsetBlack(actions.localState.board);

  if(illegalWordsData) {
      // Clear the illegalWord
      if(!wordsAndScore || !sameWordList(illegalWordsData.all, wordsAndScore.words)) {
          setIllegalWordsData(null);
      } 
  }

  if (active.length === 0 && actions.bgioProps.isMyTurn) {
      return {
          onPass: () => endTurn(actions.localState, actions.bgioProps, 0),
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
              actions.dispatch({ type: "setBlank", data: {id: blankToSet, letter: l}});
              setBlankToSet(null);
          };
      }

      if(actions.bgioProps.isMyTurn && !unsetBlank) {
          const uncheckedDone = () => {
              endTurn(actions.localState, actions.bgioProps, score);
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

