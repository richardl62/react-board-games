import { Ctx } from "boardgame.io";
import { shuffle } from "../../shared/tools";
import { BoardData, GameData } from "./game-data";
import { compactRack } from "./game-actions";
import { Letter } from "./scrabble-config";
import { Rack } from "./scrabble-data";

function fillRack(G: GameData, rack: Rack) {
    compactRack(rack);
    
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
    rack: (Letter|null)[];
    score: number;
};

const setBoardRandAndScore = (G: GameData, ctx: Ctx, 
    {board, rack, score}: setBoardRandAndScoreParam
    ) => {
    let newRack = [...rack];
    fillRack(G, newRack);
    G.playerData[ctx.currentPlayer].playableTiles = newRack;
    G.playerData[ctx.currentPlayer].score += score;

    G.board = board.map(row => row.map(
        sq => sq && {...sq, active: false}
    ));

    G.turn++;
};

type addTilesToBagParam = Letter[];
const addTilesToBag = (G: GameData, ctx: Ctx, letters: addTilesToBagParam) => {
    G.bag.push(...letters);
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