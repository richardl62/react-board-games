import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { asSpecifiedValues } from "../../../app/option-specification/tools";
import { sAssert } from "../../../utils/assert";
import { setupOptions } from "../options";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_ctx: Ctx, setupData: unknown): ServerData {
    const options = asSpecifiedValues(setupData, setupOptions);
    sAssert(options, "setupData does not have the expected type");
    
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
