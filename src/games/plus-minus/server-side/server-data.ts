import { Ctx } from "boardgame.io";

export interface ServerData {
    count: number;
    
    serverError: string | null;
    serverTimestamp: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        serverError: null,
        serverTimestamp: 0,
    };
}
