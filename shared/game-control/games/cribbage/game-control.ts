import { GameControl, AllActive } from "../../game-control.js";
import { moves } from "./moves/moves.js";
import { startingServerData } from "./starting-server-data.js";

export const gameControl: GameControl = {
    name: "cribbage",

    setup: startingServerData,

    minPlayers: 2,
    maxPlayers: 2,

    moves,

    // Turn order is not enforced.
    turnOrder: AllActive
};