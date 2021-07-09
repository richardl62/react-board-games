import { useState } from "react";
import styled from "styled-components";
import { isLegalWord } from "./is-legal-word";

const WordInput = styled.input`
  margin-right: 0.2em;
`
const ValidityMessage = styled.span<{ valid: boolean; }> `
  font-size: large;
  color: ${props => props.valid ? 'default' : 'red'};
`

function Validity({ valid }: { valid: boolean; }) {
  return <ValidityMessage valid={valid}>
    {valid ? "Valid" : "Not valid"}
  </ValidityMessage>;
}

export function WordChecker() {
  const [word, setEnteredWord] = useState("");
  const [valid, setValid] = useState<boolean | 'unknown'>('unknown');

  const onWordChange = (e: any) => {
    const rawWord = e.target.value;
    const word = rawWord.replace(/[^A-Za-z]/gi, '');
    setEnteredWord(word);
    setValid('unknown');
  };

  const onSubmit = (e: any) => {
    setValid(isLegalWord(word));
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>

      <WordInput
        type="text"
        placeholder={'Word to check'}
        value={word}
        spellCheck={false}
        onChange={onWordChange} />

      {valid === 'unknown' ?
        (word && <input type="submit" value="Check" />) :
        <Validity valid={valid} />}
    </form>
  );
}
