// For legacy reasons, players are identified by strings rather than numbers.
export interface Ctx {
    numPlayers: number;
    playOrder: string[];
    currentPlayer: string;
    playOrderPos: number;
    gameover?: boolean;
}
