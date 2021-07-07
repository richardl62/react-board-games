import styled from "styled-components";
import { BoardData } from "./game-data";
import {  WordCheck } from "./word-check";

const Message = styled.div`
  display: inline-block;
  font-size: large;
  font-weight: bold;
`;

export const WordInput = styled.input`
  margin-right: 0.2em;
`
interface BelowBoardProps {
  board: BoardData ;
  done: () => void;
}

export function Score({board, done} : BelowBoardProps) {
  const score = 999;
  if(score === null) {
    return <Message>Tiles are not correct placed</Message>
  }

  return (
    <div>
      <Message>Score: <span> {score}</span></Message> 
      <button onClick={done}>Done</button>
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

