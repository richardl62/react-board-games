import styled from "styled-components";
import { BoardData } from "./game-data";
import {  WordCheck } from "./word-check";

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
export function BelowBoard({endTurn} : BelowBoardProps) {
  const score = -999;
  return (
    <>
      <WordCheck />
      <Score score={score} done={() => endTurn(score)} />
    </>
  );
}

