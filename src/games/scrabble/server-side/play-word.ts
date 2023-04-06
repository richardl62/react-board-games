import { Letter } from "../config";
import { BoardData, GameState } from "./game-state";
import { WordsPlayedInfo } from "./move-hstory";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export interface PlayWordParam {
    board: BoardData;
    rack: (Letter | null)[];
    playedWordinfo: Omit<WordsPlayedInfo,"pid">
    score: number;
} 

export function playWord(
    {G: state, ctx} : MoveArg0<GameState>, 
    { board, rack: inputRack, playedWordinfo, score }: PlayWordParam
) : void
{
    const newBag = [...state.bag];
    const newRack = [...inputRack];
    
    for(let ri = 0; ri < newRack.length; ++ri) {
        if(!newRack[ri]) {
            newRack[ri] = newBag.shift() || null;
        }
    }

    state.playerData[ctx.currentPlayer].rack = newRack;
    state.playerData[ctx.currentPlayer].score += score;
    state.bag = newBag;

    // KLUDGE: 'active' does not really belong server side
    state.board = board.map(row => row.map(
        sq => sq && { ...sq, active: false }
    ));

    const info = {
        ...playedWordinfo,
        pid: ctx.currentPlayer,
    };

    state.moveHistory.push({wordsPlayed: info});  
}


