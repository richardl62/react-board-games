type Winner = { winner: number };
type Result = 'noop' | 'continue' | 'endOfTurn' | Winner;

type HistoryMarker = 'history marker' | 'not history marker';

export class MoveResult {
    constructor(result: Result, historMarker?: HistoryMarker) {
        this.result = result;
        this.historyMarker = historMarker ? historMarker === "history marker" :
            result === 'endOfTurn';
    }
    readonly result: Result;
    readonly historyMarker: boolean;

    get noop() { return this.result === "noop"; }
    get continue() { return this.result === "continue"; }
    get endOfTurn() { return this.result === "endOfTurn"; }

    get winner(): number | null {
        return (typeof this.result === "object") ? this.result.winner : null;
    };
}

export default MoveResult;
