import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { asSpecifiedValues } from "../../../app/option-specification/tools";
import { sAssert } from "../../../utils/assert";
import { setupOptions } from "../options";
import { SetupArg0 } from "../../../app-game-support/bgio-types";

export interface ServerData extends RequiredServerData{
    count: number;
}

export function startingServerData(_arg0: SetupArg0, setupData: unknown): ServerData {
    const options = asSpecifiedValues(setupData, setupOptions);
    sAssert(options, "setupData does not have the expected type");
    
    return {
        count: options.startingValue,
        
        ...startingRequiredState(),
    };
}
