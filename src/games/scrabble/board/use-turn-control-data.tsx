import { useState } from "react";
import { Letter } from "../config";
import { getWordsAndScore, findActiveLetters, SquareID } from "../local-actions";
import { findUnsetBlack } from "../local-actions/board-and-rack";
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
    const wordsAndScore = getWordsAndScore(context, active);
    const unsetBlank = findUnsetBlack(context.board);

    if (illegalWordsData) {
        // Clear the illegalWord
        if (!wordsAndScore || !sameWordList(illegalWordsData.all, wordsAndScore.words)) {
            setIllegalWordsData(null);
        }
    }
    const isMyTurn = context.playerID === context.currentPlayer; 
    if (active.length === 0) {
        if (isMyTurn) {
            return {
                onPass: () => {
                    context.wrappedGameProps.moves.pass();
                },
            };
        } else {
            return {};
        }
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
        const isMyTurn = context.playerID === context.currentPlayer; 
        if (isMyTurn && !unsetBlank) {

            const playWord = () => {
                
                context.wrappedGameProps.moves.playWord({
                    board: context.board,
                    rack: context.rack,
                    score: wordsAndScore.score,
                    playedWordinfo: {
                        ...wordsAndScore,
                        illegalWords: wordsAndScore.illegalWords || [],
                    },

                });
            
                setIllegalWordsData(null);
            };

            const conditionalPlayWord = () => {
                if (!illegalWords) {
                    playWord();
                } else {
                    setIllegalWordsData({ all: words, illegal: illegalWords });
                }
            };

            result.onDone = illegalWordsData ? playWord : conditionalPlayWord;
        }

        return result;
    }
}

