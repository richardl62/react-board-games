import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { toGameOptions } from "../options";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_ctx: Ctx, startupData: unknown): ServerData {
    const options = toGameOptions(startupData);
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
