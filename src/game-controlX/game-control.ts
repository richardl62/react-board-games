import { Game, SetupArg0 } from "./game";
import { RequiredServerData } from "./required-server-data";

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl extends Game { 
  // Space-free name used to identify the game (c.f. displayName in AppGame).
  name: string

  moves: Required<Game>["moves"];

  // KLUDGE?: The setup function is expected to return a type derived from
  // RequiredState. Specifying the return type as RequiredStates enforces this.
  setup: (arg0: SetupArg0, setupData?: unknown) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,
}