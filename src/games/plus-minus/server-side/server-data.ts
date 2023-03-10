import { Ctx } from "boardgame.io";
import { RequiredState, startingRequiredState } from "../../../app-game-support/required-state";

export interface ServerData extends RequiredState{
    count: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        ...startingRequiredState,
    };
}
