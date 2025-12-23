import { SetupArg0 } from "../../game-control.js";

export interface ServerData {
    count: number;
}

export function startingServerData(_arg0: SetupArg0): ServerData {
    return {
        count: 0,
    };;
}
