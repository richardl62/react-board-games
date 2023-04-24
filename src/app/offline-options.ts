import { OptionValue } from "./option-specification/types";

export interface OfflineOptions {
    numPlayers: number;
    passAndPlay: boolean;
    debugPanel: boolean;
    // KLUDGE? An empty object (rather than null) is used when there is no
    // setup data.
    setupData: {[key: string]: OptionValue};
}
