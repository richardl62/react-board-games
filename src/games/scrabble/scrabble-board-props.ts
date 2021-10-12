import { AppBoardProps } from "shared/app-board-props";
import { GameData } from "./game-data";
import { ScrabbleConfig } from "./scrabble-config";

export interface ScrabbleBoardProps extends AppBoardProps<GameData> {
    config: ScrabbleConfig;
}