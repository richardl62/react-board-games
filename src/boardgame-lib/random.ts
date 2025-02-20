//export type { RandomAPI } from "boardgame.io/dist/types/src/plugins/random/random";
export interface RandomAPI {
    Die(spotvalue?: number): number;
    Shuffle<T>(deck: T[]): T[];
}