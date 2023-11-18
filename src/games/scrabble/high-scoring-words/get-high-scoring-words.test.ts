import { Trie } from "../../../utils/word-finder/trie";
import { BoardAndRack, Rack } from "../client-side/board-and-rack";
import { SquareType } from "../config";
import { BoardData } from "../server-side/game-state";
import { getHighScoringWords } from "./get-high-scoring-words";

//const D = SquareType.doubleWord;
//const T = SquareType.tripleWord;
//const d = SquareType.doubleLetter;
//const t = SquareType.tripleLetter;
const s = SquareType.simple;

type Result = ReturnType<typeof getHighScoringWords>;

test("get high scoring words - empty board", ()=>{
    const words = ["AA", "AAAA"];
    const board : BoardData = [
        [null,null,null,null,null],
    ];
    const rack: Rack = ["A","A","A","A"];
    const boardLayout = [
        [s,s,s,s,s],
    ];
    const allLetterBonus = 0;

    const result = getHighScoringWords(
        new BoardAndRack(board, rack),
        new Trie(words),
        {boardLayout, rackSize: rack.length, allLetterBonus},
    );

    const expected: Result = [
        { "col": 0, "word": "AAAA"},
        { "col": 1, "word": "AAAA"},
        { "col": 1, "word": "AA"},
        { "col": 2, "word": "AA"},
    ].map(arg => {
        const {col, word} = arg;
        return {
            col,
            row: 0,
            direction: "row",
            word,
            score: word.length,
        };
    });

    
    console.log("result");
    for(const res of result) {
        console.log(res);
    }

    expect(result).toEqual(expected);
});