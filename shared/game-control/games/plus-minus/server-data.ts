import { SetupArg0 } from "../../game-control.js";

export interface SetupOptions {
    readonly startingValue: number;
}

export interface ServerData {
    count: number;
}

export function startingServerData(_arg0: SetupArg0, options: SetupOptions): ServerData {
    return {
        count: options.startingValue,        
    };
}
