import { configs } from "./scrabble-config";
import { makeAppGame } from "./app-game";

const games = configs.map(makeAppGame);
export default games;