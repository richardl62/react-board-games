import { useState } from "react";
import { getWordsAndScore, findActiveLetters, SquareID } from "../client-side";
import { findUnsetBlack } from "../client-side/board-and-rack";
import { useScrabbleContext } from "../client-side/scrabble-context";

function sameWordList(words1: string[], words2: string[]): boolean {
    return words1.join() === words2.join();
}

export interface TurnControlData {
    illegalWords?: string[];
    onPass?: (() => void);
    onDone?: () => void;

    unsetBlank: SquareID | null;
}

export function useTurnControlData(): TurnControlData {
    const context = useScrabbleContext();
    interface IllegalWordsData {
        illegal: string[]; // Words to report
        all: string[]; // All words at time illegal words were recorded.
    }
    const [illegalWordsData, setIllegalWordsData] = useState<IllegalWordsData | null>(null);

    const active = findActiveLetters(context);
    const wordsAndScore = getWordsAndScore(context, active);

    const result : TurnControlData = {
        unsetBlank: findUnsetBlack(context.board)
    }; 

    if (illegalWordsData) {
        // Clear the illegalWord
        if (!wordsAndScore || !sameWordList(illegalWordsData.all, wordsAndScore.words)) {
            setIllegalWordsData(null);
        }
    }
    const isMyTurn = context.playerID === context.currentPlayer; 
    if (active.length === 0) {
        if (isMyTurn) {
            result.onPass = () => {
                context.wrappedGameProps.moves.pass();
            };
        }
        return result;
    } else if (!wordsAndScore) {
        return result;
    } else {

        const { words, illegalWords } = wordsAndScore;


        if (illegalWordsData) {
            result.illegalWords = illegalWordsData.illegal;
        }

        const isMyTurn = context.playerID === context.currentPlayer; 
        if (isMyTurn && !result.unsetBlank) {

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

