import { ServerData } from "./server-data";

export function startingServerData(): ServerData {
    return {
        count: 0,
        
        serverError: null,
        serverTimestamp: 0,
    };
}
