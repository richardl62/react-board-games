import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { GameState, GameStage } from "./game-state";


export function makeGameState(): GameState {

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
