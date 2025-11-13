// This class is a cut-down version of the Ctx class in boardgame.io.
// For legacy reasons, players are identified by strings rather than numbers.
export class Ctx {
    readonly playOrder: string[];
    protected _playOrderPos: number;  // Can be changed by subclasses.

    constructor(playOrder: string[], playOrderPos: number) {
        this.playOrder = playOrder;
        this._playOrderPos = playOrderPos;
    }

    get numPlayers(): number {
        return this.playOrder.length;
    }

    get currentPlayer(): string {
        return this.playOrder[this._playOrderPos];
    }

    nextPlayOrderPos() {
        return (this._playOrderPos + 1) % this.playOrder.length;
    }

    get playOrderPos() {
        return this._playOrderPos;
    }
}

export class ServerCtx extends Ctx {
    constructor(numPlayers: number) {
        const playOrder = [];
        for (let i = 0; i < numPlayers; i++) {
            playOrder.push(i.toString());
        }
        super(playOrder, 0);
    }

    endTurn() {
        this._playOrderPos = this.nextPlayOrderPos();
    }

    makeCopy() {
        const newCtx = new ServerCtx(this.numPlayers);
        newCtx._playOrderPos = this._playOrderPos;
        return newCtx;
    }
}