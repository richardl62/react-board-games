import { Move } from "boardgame.io";
import { shuffle } from "../../shared/tools";
import { CoreTile } from "./core-tile";
import { BoardData, GameData } from "./game-data";
import { Rack } from "./scrabble-data";

function fillRack(G: GameData, rack: Rack) {
    let bag = G.bag;
    for(let i = 0; i < rack.length; ++i) {
        if(rack[i] === null) {
            const fromBag = bag.pop();
            rack[i] = fromBag || null;
        }
    }
}

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (CoreTile|null)[];
    score: number;
};

const setBoardRandAndScore : Move<GameData> = (G, ctx, 
    {board, rack, score}: setBoardRandAndScoreParam
    ) => {
    console.log("setBoardRandAndScore called");
    let newRack = [...rack];
    fillRack(G, newRack);
    G.playerData[ctx.currentPlayer].playableTiles = newRack;
    G.playerData[ctx.currentPlayer].score += score;

    G.board = board.map(row => row.map(
        sq => sq && {...sq, active: false}
    ));

    G.turn++;
};

type addTilesToBagParam = CoreTile[];
const addTilesToBag : Move<GameData> = (G, ctx, tiles: addTilesToBagParam) => {
    console.log("addTilesToBag called");
    G.bag.push(...tiles);
    shuffle(G.bag);
};

export const bgioMoves = {
    setBoardRandAndScore: setBoardRandAndScore,
    addTilesToBag: addTilesToBag,
};

export interface ClientMoves {
    setBoardRandAndScore: (arg: setBoardRandAndScoreParam) => void;
    addTilesToBag: (arg: addTilesToBagParam) => void;
};