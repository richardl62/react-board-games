import { isValidIndex } from "../utils/valid-index.js";

export interface CtxData {
    playOrder: string[];
    playOrderPos: number;
    matchover: boolean;
}

export function isCtxData(obj: unknown): obj is CtxData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as CtxData;
    return Array.isArray(candidate.playOrder) &&
           typeof candidate.playOrderPos === "number" &&
           typeof candidate.matchover === "boolean";
}

// This class is a cut-down version of the Ctx class in boardgame.io.
// For legacy reasons, players are identified by strings rather than numbers.
export class Ctx {
    protected _data: CtxData;  // Can be changed by subclasses.

    constructor(data: CtxData) {
        this._data = data;
    }

    get data(): CtxData {
        return this._data;
    }

    get numPlayers(): number {
        return this.data.playOrder.length;
    }

    get currentPlayer(): string {
        const { playOrderPos, playOrder } = this.data;
        if (!isValidIndex(playOrder, playOrderPos)) {
            throw new Error(`Invalid playOrderPos: ${playOrderPos}`);
        }

        return this.data.playOrder[this.data.playOrderPos];
    }

    get playOrder() {
        return this.data.playOrder;
    }

    get playOrderPos() {
        return this.data.playOrderPos;
    }
    
    get matchover() {
        return this.data.matchover;
    }

    nextPlayOrderPos() {
        return (this.playOrderPos + 1) % this.playOrder.length;
    }
}

export class ServerCtx extends Ctx {
    constructor(data: CtxData) {
        super(data);
    }

    endTurn() {
        if (this.data.matchover) {
            throw new Error("End turn attempt after match is over.");
        }

        this.data.playOrderPos = this.nextPlayOrderPos();
    }

    endMatch() {
        this.data.matchover = true;
    }

    makeCopy() : ServerCtx  {
        return new ServerCtx(structuredClone(this.data));
    }
}

export function makeServerCtx(numPlayers: number): ServerCtx {
    const playOrder: string[] = [];
    for (let i = 0; i < numPlayers; i++) {
        playOrder.push(i.toString());
    }

    const data: CtxData = {
        playOrder,
        playOrderPos: 0,
        matchover: false,
    };
    return new ServerCtx(data);
}