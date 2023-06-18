import React, { useState } from "react";
import styled from "styled-components";
import { useScrabbleContext } from "../client-side/scrabble-context";

const WordInput = styled.input`
  margin-right: 0.2em;
`;
const ValidityMessage = styled.span<{ valid: boolean; }> `
  font-size: large;
  color: ${props => props.valid ? "default" : "red"};
`;

function Validity({ valid }: { valid: boolean; }) {
    return <ValidityMessage valid={valid}>
        {valid ? "Valid" : "Not valid"}
    </ValidityMessage>;
}

export function WordChecker(): JSX.Element {
    const [word, setEnteredWord] = useState("");
    const [valid, setValid] = useState<boolean | "unknown">("unknown");
    const { dispatch, legalWords } = useScrabbleContext();

    const onWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawWord = e.target.value;
        const word = rawWord.replace(/[^A-Za-z]/gi, "");
        setEnteredWord(word);
        setValid("unknown");
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setValid(legalWords.hasWord(word));
        e.preventDefault();
    };

    const focusIn = (arg: boolean) => {
        dispatch({type: "focusInWordChecker", data: {focusIn: arg}});    
    };

    return (
        <form onSubmit={onSubmit}>

            <WordInput
                type="text"
                placeholder={"Word to check"}
                value={word}
                spellCheck={false}
                onChange={onWordChange} 
                onFocus={()=>focusIn(true)}
                onBlur={()=>focusIn(false)}
            />

            {valid === "unknown" ?
                (word && <input type="submit" value="Check" />) :
                <Validity valid={valid} />}
        </form>
    );
}
