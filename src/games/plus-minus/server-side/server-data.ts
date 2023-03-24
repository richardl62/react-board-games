import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { toSpecifiedValues } from "../../../app-game-support/value-specification";
import { sAssert } from "../../../utils/assert";
import { setupOptions } from "../options";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_ctx: Ctx, setupData: unknown): ServerData {
    const options = toSpecifiedValues(setupData, setupOptions);
    sAssert(options, "setupData does not have the expected type");
    
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
