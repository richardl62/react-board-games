import { RequiredServerData, startingRequiredState } from "@/game-controlX/required-server-data";
import { SetupArg0 } from "@/game-controlX/game-control";

export interface StartingOptions {
    startingValue: number;
}

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_arg0: SetupArg0, options: StartingOptions): ServerData {
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
