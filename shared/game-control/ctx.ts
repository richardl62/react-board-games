// For legacy reasons, players are identified by strings rather than numbers.
// gameover was (temporarily?) removed when porting away from boardgame.io.
export interface Ctx {
    numPlayers: number;
    playOrder: string[];
    currentPlayer: string;
    playOrderPos: number;
}
