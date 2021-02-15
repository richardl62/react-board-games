
type MoveResultWinner = {winner: number};
export type MoveResultArg = 'noop' | 'continue' | 'endOfTurn' | MoveResultWinner;

export class MoveResult {
    constructor(result: MoveResultArg) {
        this._result = result;
    }
    private _result: MoveResultArg;

    get noop() { return this._result === "noop"; }
    get continue() { return this._result === "continue"; }
    get endOfTurn() { return this._result === "endOfTurn"; }

    get winner(): number | null {
        return (typeof this._result === "object") ? this._result.winner : null;
    };
}

export default MoveResult;
