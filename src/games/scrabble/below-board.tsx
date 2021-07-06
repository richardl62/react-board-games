import styled from "styled-components";

const Message = styled.div`
  display: inline-block;
  margin-right: 0.5em;
  font-size: large;
  font-weight: bold;
`;


interface BelowBoardProps {
  score: number | null ;
  done: () => void;
}
export function BelowBoard({score, done} : BelowBoardProps) {
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
