import React from "react";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { LetterSet } from "../../../utils/word-finder/letter-set";

export function AvailableWords(): JSX.Element | null {
    const {rack, legalWords, reviewGameHistory } = useScrabbleContext();

    type State = {rackLetters: string, words: string[]}
    const [{words, rackLetters: recordedRackLetters}, setState] = React.useState<State>({words: [], rackLetters: ""});

    const currentRackLetters = rack.join("");
    if(recordedRackLetters !== currentRackLetters) {
        setState({words: [], rackLetters: currentRackLetters});
    }

    //KLUDGE?: Make available words available only when reviewing game history.
    if(!reviewGameHistory) {
        return null;
    }

    const getWords = () => {
        let letters = "";
        let nWildcards = 0;
        for(const tile of rack) {
            if (tile === "?") {
                nWildcards++;
            } else if (tile) {
                letters += tile;
            }
        }
        
        const words = legalWords.findWords(new LetterSet(letters, nWildcards));

        if (words.length === 0) {
            return ["No words found"];
        }

        // Return words sorted by length, longest first, and uppercase.
        return words.sort((a, b) => b.length - a.length).map((word) => word.toUpperCase());
    };

    const onButtonClick = () => {
        const words = getWords();
        setState({words, rackLetters: currentRackLetters});
    };
    return <div>
        <button onClick={onButtonClick}>Show Available Words</button>
        {words.map((word) => <div key={word}>{word}</div>)}
    </div>;
}