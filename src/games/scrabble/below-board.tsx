import styled from "styled-components";
import assert from "../../shared/assert";
import { findCandidateWords } from "./find-candidate-words";
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

export interface BelowBoardProps {
  board: BoardData;
  endTurn: (score: number) => void
}
export function BelowBoard({board, endTurn} : BelowBoardProps) {
  const cwords = findCandidateWords(board);
  const score = cwords && scoreWords(board, cwords);

  return (
    <>
      <WordChecker />
      <Score score={score}
        done={() => { assert(score !== null); endTurn(score) }}
      />
    </>
  );
}

