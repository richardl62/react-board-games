import styled from "styled-components";
import assert from "../../shared/assert";
import { checkWord } from "./check-word";
import { findCandidateWords, RowCol } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { BoardData } from "./game-data";
import { scoreWords } from "./score-word";

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

/** Return a sorted list of invalid words, or null if there are none */
function findInvalidWords(board: BoardData, cwords: RowCol[][]) : string[] | null {
    let invalid : string[] = [];
    cwords.forEach(cw => {
      const word = getWord(board, cw);
      if(!checkWord(word)) {
        invalid.push(word);
      }
    })
    
    return invalid.length > 0 ? invalid.sort() : null;
}

interface EndTurnActionsProps {
  board: BoardData;
  endTurn: (score: number) => void
}

export function EndTurnActions({board, endTurn} : EndTurnActionsProps) {
  const cwords = findCandidateWords(board);

  if(!cwords) {
    return <Message>Place tiles in valid positions</Message>
  }

  const score = scoreWords(board, cwords);
  const invalidWords = findInvalidWords(board, cwords);

  return (
    <>
      <Score score={score}
        done={() => { assert(score !== null); endTurn(score) }}
      />
      <div>{invalidWords}</div>
    </>
  );
}



