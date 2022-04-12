export interface ScoreCard {
    lenght3: number;
    length4: number;
    length5: number;
}

export function newScoreCard() : ScoreCard {
    return {
        lenght3: 0,
        length4: 0,
        length5: 0,
    };
}