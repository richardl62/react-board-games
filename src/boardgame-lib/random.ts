export interface RandomAPI {
    Die(spotvalue?: number): number;
    Shuffle<T>(deck: T[]): T[];
}