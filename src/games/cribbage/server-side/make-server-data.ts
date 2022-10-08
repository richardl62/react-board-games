import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage } from "./server-data";

export function makeServerData(): ServerData {

    const cards = deck({ jokers: false, shuffled: true });

    const meHand = cards.splice(0, cardsPerHand);
    const poneHand = cards.splice(0, cardsPerHand);
    const cutCard = cards[0];

    return {
        me: {
            hand: meHand,
            fullHand: [...meHand],
        },

        pone: {
            hand: poneHand,
            fullHand: [...meHand],
        },

        shared: {
            hand: [],
        },

        box: [],

        stage: GameStage.SettingBox,

        cutCard: {
            card: cutCard,
            visible: false,
        },
    };
}
