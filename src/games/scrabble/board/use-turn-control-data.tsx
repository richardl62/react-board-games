import { useState } from "react";
import { Letter } from "../config";
import { getWordsAndScore, findActiveLetters, SquareID } from "../actions";
import { findUnsetBlack } from "../actions/board-and-rack";
import { playWord, passMove } from "../actions/game-actions";
import { useScrabbleContext } from "./scrabble-context";

function sameWordList(words1: string[], words2: string[]): boolean {
    return words1.join() === words2.join();
}

export interface TurnControlData {
    score?: number | "-";
    illegalWords?: string[];
    onPass?: (() => void);

    onSetBlank?: () => void;
    doSetBlank?: (arg: Letter) => void;

    onDone?: () => void;
}

export function useTurnControlData(): TurnControlData {
    const context = useScrabbleContext();
    interface IllegalWordsData {
        illegal: string[]; // Words to report
        all: string[]; // All words at time illegal words were recorded.
    }
    const [illegalWordsData, setIllegalWordsData] = useState<IllegalWordsData | null>(null);
    const [blankToSet, setBlankToSet] = useState<SquareID | null>(null);

    const active = findActiveLetters(context);
    const wordsAndScore = getWordsAndScore(context, context.config, active);
    const unsetBlank = findUnsetBlack(context.board);

    if (illegalWordsData) {
        // Clear the illegalWord
        if (!wordsAndScore || !sameWordList(illegalWordsData.all, wordsAndScore.words)) {
            setIllegalWordsData(null);
        }
    }

    if (active.length === 0 && context.bgioProps.isMyTurn) {
        return {
            onPass: () => passMove(context.bgioProps),
        };
    } else if (!wordsAndScore) {
        return {
            score: "-",
        };
    } else {

        const { score, words, illegalWords } = wordsAndScore;


        const result: TurnControlData = {};

        result.score = score;

        if (illegalWordsData) {
            result.illegalWords = illegalWordsData.illegal;
        }

        if (unsetBlank) {
            result.onSetBlank = () => setBlankToSet(unsetBlank);
        }

        if (blankToSet) {
            result.doSetBlank = (l: Letter) => {
                context.dispatch({ type: "setBlank", data: { id: blankToSet, letter: l } });
                setBlankToSet(null);
            };
        }

        if (context.bgioProps.isMyTurn && !unsetBlank) {

            const uncheckedDone = () => {
                const illegalWords = wordsAndScore.illegalWords || [];
                playWord(context, context.bgioProps, { ...wordsAndScore, illegalWords: illegalWords });
                setIllegalWordsData(null);
            };

            const checkedDone = () => {
                if (!illegalWords) {
                    uncheckedDone();
                } else {
                    setIllegalWordsData({ all: words, illegal: illegalWords });
                }
            };

            result.onDone = illegalWordsData ? uncheckedDone : checkedDone;
        }

        return result;
    }
}

