import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        serverError: null,
        serverTimestamp: 0,
    };
}
