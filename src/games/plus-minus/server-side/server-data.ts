import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        ...startingRequiredState(),
    };
}
