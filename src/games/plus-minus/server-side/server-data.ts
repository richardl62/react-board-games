import { RequiredServerData, startingRequiredState } from "@/game-controlX/required-server-data";
import { SetupOptions } from "../options";
import { SetupArg0 } from "@/game-controlX/game-control";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_arg0: SetupArg0, options: SetupOptions): ServerData {
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
