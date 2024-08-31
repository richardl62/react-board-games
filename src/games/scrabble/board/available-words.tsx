import React from "react";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Rack } from "../client-side/board-and-rack";
import { Trie } from "../../../utils/word-finder/trie";

function getAvailableWords(rack: Rack, legalWords: Trie) {
    let letters = "";
    let nWildcards = 0;
    for (const tile of rack) {
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
}

function sameRack(rack1: Rack, rack2: Rack) {
    return rack1.join() === rack2.join();
}

export function AvailableWords(): JSX.Element | null {
    const {rack, legalWords, reviewGameHistory } = useScrabbleContext();

    const [showAvailableWords, setShowAvailableWords] = React.useState(true);
    const [wordsToShow, setWordsToShow] = 
        React.useState<{words: string[], generatingRack: Rack}>({words: [], generatingRack: []});

    if (!reviewGameHistory) {
        return null;
    }
    
    if(!sameRack(rack, wordsToShow.generatingRack)) {
        const words = showAvailableWords ? getAvailableWords(rack, legalWords) : [];
        setWordsToShow({words, generatingRack: rack});
    }

    const onCheckBoxChange = () => {
        setShowAvailableWords(!showAvailableWords);
        setWordsToShow({words:[], generatingRack:[]}); // Force recalculation of wordsToShow
    };

    return <div>
        <div>
            <label> {"Show available words "}
                <input type="checkbox" checked={showAvailableWords}
                    onChange={onCheckBoxChange}
                />
            </label>
        </div>
 
        {wordsToShow.words.map((word) => <div key={word}>{word}</div>)}
    </div>;
}