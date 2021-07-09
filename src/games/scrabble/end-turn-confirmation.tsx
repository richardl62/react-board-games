import { useEffect, useState } from "react";
import styled from "styled-components";
import { checkWord } from "./check-word";

export const Message = styled.div`
  display: inline-block;
  font-size: large;
  font-weight: bold;
  margin-right: 0.5em;
`;

const InvalidWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
`

interface EndTurnConfirmationProps {
  words: string[];
  endTurn: () => void;
}

export function EndTurnConfirmation({ words, endTurn}: EndTurnConfirmationProps) {
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
      endTurn();
    } else {
      setWordsToConfirm(invalid);
    }
  }

  const permitIllegal = (allow: boolean) => {
    setWordsToConfirm([]);
    if (allow) {
      endTurn();
    }
  }

  if (wordsToConfirm.length === 0) {
    return <button onClick={onDoneClick}>Done</button>
  } else {
    return (
      <InvalidWords>
        IllLegal Words:
        {words.map(w => <span key={w}>{w.toLocaleLowerCase()}</span>)}
        <button onClick={() => permitIllegal(true)}>Allow</button>
        <button onClick={() => permitIllegal(false)}>Don't Allow</button>
      </InvalidWords>
    );
  }
}

