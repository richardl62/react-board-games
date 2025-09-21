import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupArg0 } from "../../../boardgame-lib/game";

export interface ServerData extends RequiredServerData {
    count: number;
}

export function startingServerData(_arg0: SetupArg0): ServerData {
    return {
        count: 0,
        
        ...startingRequiredState(),
    };
}
