import { Letter } from "../../config";
import { getWords } from "./get-words";

export function findIllegalWords(
    grid: (Letter | null)[][],
    isLegalWord: (word: string) => boolean,
): string[] | null {
    
    const words = getWords(grid).map(word => word.replace(/Q/g,"Qu"));
    const illegalWords = words.filter(word => !isLegalWord(word));
    
    return illegalWords.length === 0 ? null : illegalWords;
}