import styled from "styled-components";
import assert from "../../shared/assert";
import { checkWord } from "./check-word";
import { findCandidateWords, RowCol } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { BoardData } from "./game-data";
import { scoreWords } from "./score-word";
import {  WordChecker } from "./word-check";

const Message = styled.div`
  display: inline-block;
  font-size: large;
  font-weight: bold;
  margin-right: 0.5em;
`;

interface ScoreProps {
  score: number | null ;
  done: () => void;
}

function Score({score, done} : ScoreProps) {
  return (
    <div>
      <Message>Score: <span> {score ? score : '-'}</span></Message> 
      <button onClick={done} disabled={!score}>Done</button>
    </div>
  );
}

function findInvalidWords(board: BoardData, cwords: RowCol[][]) : string[] {
    let invalid : string[] = [];
    cwords.forEach(cw => {
      const word = getWord(board, cw);
      if(!checkWord(word)) {
        invalid.push(word);
      }
    })
    
    return invalid.sort();
}

export interface BelowBoardProps {
  board: BoardData;
  endTurn: (score: number) => void
}
export function BelowBoard({board, endTurn} : BelowBoardProps) {
  const cwords = findCandidateWords(board);
  const score = cwords && scoreWords(board, cwords);
  const invalidWords = cwords && findInvalidWords(board, cwords);

  return (
    <>
      <WordChecker />
      <Score score={score}
        done={() => { assert(score !== null); endTurn(score) }}
      />
      <div>{invalidWords}</div>
    </>
  );
}


