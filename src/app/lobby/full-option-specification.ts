import { AppGame } from "@/app-game-support";
import { defaultNumPlayers } from "@/app-game-support/app-game";
import { OptionValues } from "@/option-specification/types";
import { sAssert } from "@shared/utils/assert";

export function fullOptionSpecification(game: AppGame) {
    const { minPlayers, maxPlayers } = game;
    const gameOptions = game.options || {};
    
    return {
        numPlayers: {
            label: "Number of players",
            default: defaultNumPlayers(game),
            min: minPlayers,
            max: maxPlayers,
        },

        ...gameOptions,

        showDebugOptions: {
            label: "Show debug options",
            default: false,
        },

        offline: {
            label: "Play offline",
            default: false,
            debugOnly: true,
        },
        
        passAndPlay: {
            label: "Pass and play (offline only)",
            default: true,
            debugOnly: true,
            showIf: (values: OptionValues) => {
                const res = values.offline;
                sAssert(typeof res === "boolean");
                return res;
            },
        }
    } as const;
}