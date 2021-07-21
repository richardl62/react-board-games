import { useEffect, useState } from "react";
import styled from "styled-components";
import { isLegalWord } from "./is-legal-word";

const IllegalWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
  font-size: large;
  margin-bottom: 0.2em;
  font-weight: bold;
  color: darkred;
`;

interface EndTurnConfirmationProps {
  words: string[];
  endTurn: () => void;
}

export function EndTurnConfirmation({ words, endTurn}: EndTurnConfirmationProps) {
  // Notes.
  // * wordsToConfirm records the subset of 'words' which appear to be illegal.
  //   It is set when 'Done' is pressed.  
  // * If wordsToConfirm is non-empty, the 'Done' button is replaced by an
  //   'are you sure' message.
  // * wordsToConfirm is cleared (and so the 'Done' button reappear) when the input 
  //   words are changed.
  //   
  // Q?: Is there a better why to handle the state?
  const [wordsToConfirm, setWordsToConfirm] = useState<string[]>([]);
  useEffect(() => setWordsToConfirm([]), [words])

  if (wordsToConfirm.length === 0) {
    const onClick = () => {
      // Find any invalid words
      const invalid = words.filter(w => !isLegalWord(w));
  
      if (invalid.length === 0) {
        endTurn();
      } else {
        setWordsToConfirm(invalid);
      }
    }

    return (
      <div>
        <button onClick={onClick}>End Turn</button>
      </div>
    )
  } else {
    return (
      <div>
        <IllegalWords>
          Unrecognised Words:
          {wordsToConfirm.map(w => <span key={w}>{w.toLocaleLowerCase()}</span>)}
        </IllegalWords>
        <div>
          <button onClick={endTurn}>Allow Unrecognised Words</button>
        </div>
      </div>
    );
  }
}

