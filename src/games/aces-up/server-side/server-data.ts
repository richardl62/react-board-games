import { Ctx } from "boardgame.io";

export interface ServerData {
    serverError: string | null;
    serverTimestamp: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        serverError: null,
        serverTimestamp: 0,
    };
}



