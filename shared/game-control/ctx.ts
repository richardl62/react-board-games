import { isValidIndex } from "../utils/valid-index.js";

export interface CtxData {
    playOrder: string[];
    playOrderPos: number;
    matchOver: boolean;
}

export function isCtxData(obj: unknown): obj is CtxData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as CtxData;
    return Array.isArray(candidate.playOrder) &&
           typeof candidate.playOrderPos === "number" &&
           typeof candidate.matchOver === "boolean";
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
        return this.data.matchOver;
    }

    nextPlayOrderPos() {
        return (this.playOrderPos + 1) % this.playOrder.length;
    }
}

// Advance to the next player's turn.
// Can throw, but in this case no data is changed.
export function endTurn(cxtData: CtxData) {
        if (cxtData.matchOver) {
            throw new Error("End turn attempt after match is over.");
        }

        cxtData.playOrderPos = (cxtData.playOrderPos + 1) % cxtData.playOrder.length;
    }

// Report the end of the match.
// Can throw, but in this case no data is changed.
export function endMatch(cxtData: CtxData) {
    if (cxtData.matchOver) {
        throw new Error("Attempt to end match after it is over.");
    }
    cxtData.matchOver = true;
}

export function makeCtxData(numPlayers: number): CtxData {
    const playOrder: string[] = [];
    for (let i = 0; i < numPlayers; i++) {
        playOrder.push(i.toString());
    }

    return {
        playOrder,
        playOrderPos: 0,
        matchOver: false,
    };
}