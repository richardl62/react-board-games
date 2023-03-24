import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { toSetupOptions } from "../options";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_ctx: Ctx, setupData: unknown): ServerData {
    const options = toSetupOptions(setupData);
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
