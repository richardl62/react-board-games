import { RequiredServerData, startingRequiredState } from "../../required-server-data.js";
import { SetupArg0 } from "../../game-control.js";

export interface ServerData extends RequiredServerData {
    count: number;
}

export function startingServerData(_arg0: SetupArg0): ServerData {
    return {
        count: 0,
        
        ...startingRequiredState(),
    };
}
