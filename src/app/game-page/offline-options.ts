import { OptionValues } from "../../option-specification/types";

export interface OfflineOptions {
    numPlayers: number;
    passAndPlay: boolean;
    
    // KLUDGE? An empty object (rather than null) is used when there is no
    // setup data.
    setupData: OptionValues;
}
