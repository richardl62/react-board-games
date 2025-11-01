import { OptionValues } from "@/option-specification/types";

// Part of a KLUDGE. See comments in game-page.tsx.
export interface OfflineOptions {
    numPlayers: number;
    passAndPlay: boolean;
    
    // KLUDGE? An empty object (rather than null) is used when there is no
    // setup data.
    setupData: OptionValues;
}
