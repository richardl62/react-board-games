import { RequiredServerData, startingRequiredState } from "../../required-server-data";
import { SetupArg0 } from "../../game-control";

export interface SetupOptions {
    readonly startingValue: number;
}

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_arg0: SetupArg0, options: SetupOptions): ServerData {
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
