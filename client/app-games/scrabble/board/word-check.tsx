import { JSX, useState } from "react";
import styled from "styled-components";
import { useScrabbleState } from "../client-side/scrabble-state";
import { fetchDefinition } from "@/utils/fetch-definition";

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

export function WordChecker({setDefinition}: {setDefinition: (definition: string | null) => void}): JSX.Element {
    const [word, setEnteredWord] = useState("");
    const [valid, setValid] = useState<boolean | "unknown">("unknown");
    const { dispatch, legalWords } = useScrabbleState();

    const onWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawWord = e.target.value;
        const word = rawWord.replace(/[^A-Za-z]/gi, "");
        setEnteredWord(word);
        setValid("unknown");
        setDefinition(null);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // legalWords records upper case words
        const isValid = legalWords.hasWord(word.toUpperCase());
        setValid(isValid);

        if (isValid) {
            setDefinition("Loading definition...");
            fetchDefinition(word)
                .then(def => setDefinition(def ?? "No definition found."))
                .catch(() => setDefinition("Could not fetch definition."));
        }
    };

    const focusIn = (arg: boolean) => {
        dispatch({type: "focusInWordChecker", data: {focusIn: arg}});    
    };

    return (
        <form onSubmit={onSubmit}>

            <WordInput
                type="text"
                spellCheck={false}
                placeholder={"Word to check"}
                value={word}
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
