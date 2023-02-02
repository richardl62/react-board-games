import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        serverError: null,
        serverTimestamp: 0,
    };
}
