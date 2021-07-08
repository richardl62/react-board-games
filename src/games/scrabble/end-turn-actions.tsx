import { useEffect, useState } from "react";
import styled from "styled-components";
import { checkWord } from "./check-word";
import { findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { BoardData } from "./game-data";
import { scoreWords } from "./score-word";

const Message = styled.div`
  display: inline-block;
  font-size: large;
  font-weight: bold;
  margin-right: 0.5em;
`;

const StyledInvalidWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
`
interface PermitIllegalWordsProps {
  words: string[];
  permitIllegal: (allow: boolean) => void;
}

function PermitIllegalWords({ permitIllegal, words }: PermitIllegalWordsProps) {
  return (
    <StyledInvalidWords>
      IllLegal Words:
      {words.map(w => <span key={w}>{w.toLocaleLowerCase()}</span>)}
      <button onClick={() => permitIllegal(true)}>Allow</button>
      <button onClick={() => permitIllegal(false)}>Don't Allow</button>
    </StyledInvalidWords>
  );
}

interface DoneButtonsProps {
  words: string[];
  done: () => void;
}

function DoneButtons({ words, done }: DoneButtonsProps) {
  // Note on state.
  // * wordsToConfirm records the subset of 'words' which appear to be illegal.
  //   It set when 'Done' is pressed.  
  // * If wordsToConfirm is non-empty, the 'Done' button is replaced by an
  //   'are you sure' message.
  // * wordsToConfirm is cleared (and so the 'Done' button reappear) when the input 
  //   words are changed.
  //   
  // KLUDGE?: Is there a better why to handle the state?
  const [wordsToConfirm, setWordsToConfirm] = useState<string[]>([]);
  useEffect(() => setWordsToConfirm([]), [words])

  const onDoneClick = () => {
    // Find any invalid words
    const invalid = words.filter(w => !checkWord(w));

    if (invalid.length === 0) {
      done();
    } else {
      setWordsToConfirm(invalid);
    }
  }

  const permitIllegal = (allow: boolean) => {
    setWordsToConfirm([]);
    if (allow) {
      done();
    }
  }

  if (wordsToConfirm.length === 0) {
    return <button onClick={onDoneClick}>Done</button>
  } else {
    return <PermitIllegalWords words={wordsToConfirm} permitIllegal={permitIllegal} />
  }
}

interface EndTurnActionsProps {
  board: BoardData;
  endTurn: (score: number) => void
}

export function EndTurnActions({ board, endTurn }: EndTurnActionsProps) {
  const cwords = findCandidateWords(board);

  if (!cwords) {
    return <Message>Place tiles in valid positions</Message>
  }

  const score = scoreWords(board, cwords);
  const words = cwords.map(cw => getWord(board, cw));

  return (
    <>
      <div>
        <Message>Score: <span> {score}</span></Message>
        <DoneButtons
          words={words}
          done={() => endTurn(score)}
        />
      </div>
    </>
  );
}

