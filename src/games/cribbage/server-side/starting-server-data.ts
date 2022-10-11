import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage } from "./server-data";

export function newDealData(): Omit<ServerData, "serverError" | "serverTimestamp"> {

    const cards = deck({ jokers: false, shuffled: true });

    const playerData = () => {
        const hand = cards.splice(0, cardsPerHand);
        return {
            hand,
            fullHand: [...hand],
            score: 0,
            trailingPeg: -1,
        };
    };

    return {
        player0: playerData(),
        player1: playerData(),

        shared: {
            hand: [],
        },

        box: [],

        stage: GameStage.SettingBox,

        cutCard: {
            card: cards.pop()!,
            visible: false,
        },
    };
}

export function startingServerData(): ServerData {

    return {
        ...newDealData(),
        serverError: null,
        serverTimestamp: 0,
    };
}
