import { BoardProps } from "../../shared/types";
import { GameData } from "./game-data";
import { ScrabbleConfig } from "./scrabble-config";

export interface ScrabbleBoardProps extends BoardProps<GameData> {
    config: ScrabbleConfig;
}