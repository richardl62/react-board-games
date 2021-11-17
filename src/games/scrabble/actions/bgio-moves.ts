import { Move } from "boardgame.io";
import { sAssert } from "shared/assert";
import { shuffle } from "shared/tools";
import { Actions } from "./actions";
import { CoreTile } from "./core-tile";
import { BoardData, GlobalGameState } from "./global-game-state";

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (CoreTile | null)[];
    bag: CoreTile[];
    score: number;
}

const setBoardRandAndScore: Move<GlobalGameState> = (G, ctx,
    { board, rack, bag, score }: setBoardRandAndScoreParam
) => {

    G.bag = bag;
    G.playerData[ctx.currentPlayer].playableTiles = rack;
    G.playerData[ctx.currentPlayer].score += score;

    // KLUDGE: 'active' does not really belong server side
    // And if it did, the logic for setting it might be better
    // client side.
    G.board = board.map(row => row.map(
        sq => sq && { ...sq, active: false }
    ));

    G.turn++;
    G.timestamp++;
};

export const bgioMoves = {
    setBoardRandAndScore: setBoardRandAndScore,
};

interface ClientMoves {
    setBoardRandAndScore: (arg: setBoardRandAndScoreParam) => void;
}

function clientMoves(actions: Actions) : ClientMoves {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return actions.generalProps.moves as any;
}

export function endTurn(actions: Actions, score: number) : void {
    const rack = [...actions.localState.rack];
    const bag = [...actions.localState.bag];
    for (let ri = 0; ri < rack.length; ++ri) {
        if(!rack[ri]) {
            rack[ri] = bag.pop() || null;
        }
    }

    clientMoves(actions).setBoardRandAndScore({
        score: score,
        rack: rack,
        board: actions.localState.board,
        bag: bag,
    });    
    sAssert(actions.generalProps.events.endTurn);
    actions.generalProps.events.endTurn();
}

export function swapTiles(actions: Actions, toSwap: boolean[]) : void {
    const bag = [...actions.localState.bag];

    for (let ri = 0; ri < toSwap.length; ++ri) {
        if (toSwap[ri]) {
            const old = actions.localState.rack[ri];
            sAssert(old, "Attempt to swap non-existant tile");
            bag.push(old);
            actions.localState.rack[ri] = bag.shift()!;
        }
    }
    shuffle(bag);
    
    clientMoves(actions).setBoardRandAndScore({
        score: 0,
        rack: actions.localState.rack,
        board: actions.localState.board,
        bag: bag,
    });    
    sAssert(actions.generalProps.events.endTurn);
    actions.generalProps.events.endTurn();
}
