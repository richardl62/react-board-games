import { Move } from "boardgame.io";
import { sAssert } from "../../../shared/assert";
import { BgioGameProps } from "../../../shared/bgio-game-props";
import { shuffle } from "../../../shared/tools";
import { Letter } from "../config";
import { CoreTile, makeCoreTile } from "./core-tile";
import { BoardData, GlobalGameState } from "./global-game-state";
import { LocalGameState } from "./local-game-state";

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (CoreTile | null)[];
    bag: Letter[];
    score: number;
}

const setBoardRandAndScore: Move<GlobalGameState> = (G, ctx,
    { board, rack, bag, score }: setBoardRandAndScoreParam
) => {

    G.bag = bag;
    G.playerData[ctx.currentPlayer].rack = rack;
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

function clientMoves(bgioProps: BgioGameProps) : ClientMoves {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return bgioProps.moves as any;
}

export function endTurn(localState: LocalGameState, bgioProps: BgioGameProps, score: number) : void {
    const rack = [...localState.rack];
    const bag = [...localState.bag];
    for (let ri = 0; ri < rack.length; ++ri) {
        if(!rack[ri]) {
            const letter = bag.pop();
            rack[ri] = letter ? makeCoreTile(letter) : null;
        }
    }

    clientMoves(bgioProps).setBoardRandAndScore({
        score: score,
        rack: rack,
        board: localState.board,
        bag: bag,
    });    
    sAssert(bgioProps.events.endTurn);
    bgioProps.events.endTurn();
}

export function swapTiles(localState: LocalGameState, bgioProps: BgioGameProps, toSwap: boolean[]) : void {
    const bag = [...localState.bag];

    for (let ri = 0; ri < toSwap.length; ++ri) {
        if (toSwap[ri]) {
            const old = localState.rack[ri];
            sAssert(old, "Attempt to swap non-existant tile");
            bag.push(old.letter);
            localState.rack[ri] = makeCoreTile(bag.shift()!);
        }
    }
    shuffle(bag);
    
    clientMoves(bgioProps).setBoardRandAndScore({
        score: 0,
        rack: localState.rack,
        board: localState.board,
        bag: bag,
    });    
    sAssert(bgioProps.events.endTurn);
    bgioProps.events.endTurn();
}
