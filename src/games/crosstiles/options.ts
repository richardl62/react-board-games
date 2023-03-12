export type GameOptions = {
    timeToMakeGrid: number;
    makeGridCountdown: number;
    rackSize: number;
    minVowels: number;
    minConsonants: number;
    minBonusLetters: number;
    checkSpelling: boolean;
    checkGridBeforeRecoding: boolean,
    playersGetSameLetters: boolean;
};

export const defaultOptions: GameOptions = {
    timeToMakeGrid: 60,
    makeGridCountdown: 5,
    rackSize: 8,
    minVowels: 2,
    minConsonants: 4,
    minBonusLetters: 0,
    checkSpelling: true,
    checkGridBeforeRecoding: true,
    playersGetSameLetters: true,
}; 