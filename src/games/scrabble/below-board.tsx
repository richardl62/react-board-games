import styled from "styled-components";
import {  WordCheck } from "./word-check";

const Message = styled.div`
  display: inline-block;
  font-size: large;
  font-weight: bold;
  margin-right: 0.5em;
`;

export const WordInput = styled.input`
  margin-right: 0.2em;
`
interface BelowBoardProps {
  score: number | null ;
  done: () => void;
}

export function Score({score, done} : BelowBoardProps) {
  return (
    <div>
      <Message>Score: <span> {score ? score : '-'}</span></Message> 
      <button onClick={done} disabled={!score}>Done</button>
    </div>
  );
}

export function BelowBoard(props : BelowBoardProps) {
  return (
    <>
      <WordCheck />
      <Score {...props} />
    </>
  );
}

