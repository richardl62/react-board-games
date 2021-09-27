import { AppGame } from "../shared/types";
import bobail from "./bobail";
import chess from "./chess";
import draughts from "./draughts";
import scrabble from "./scrabble";
import plusminus from "./simple";

export const games : Array<AppGame> = [
    ...bobail, 
    ...chess, 
    ...draughts, 
    ...scrabble,
    ...plusminus];