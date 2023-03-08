import { Ctx } from "boardgame.io";

export interface ServerData {
    count: number;
    
    moveError: string | null;
    moveCount: number;
}

export function startingServerData(_ctx: Ctx): ServerData {
    return {
        count: 0,
        
        moveError: null,
        moveCount: 0,
    };
}
