import { Ctx } from "boardgame.io";

export interface ServerData {
    count: number;
    
    moveError: string | null;
    serverTimestamp: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        moveError: null,
        serverTimestamp: 0,
    };
}
