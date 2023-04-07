import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { Card } from "../../../utils/cards";
import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage, PegPositions, PlayerData } from "./server-data";
import { shuffle } from "../../../utils/shuffle";

interface PlayerPegPositions {
    player0: PegPositions;
    player1: PegPositions;
}

function playerData(cards: Card[], pegPos: PegPositions): PlayerData {

    const hand = cards.splice(0, cardsPerHand);

    return {
        hand,
        fullHand: [...hand],
        request: null,

        // Explicitly assign the required members of pegPos rather than using 
        // ...pegPos. This prevents any non-required members also being copied. 
        // (Previous use of ...pegPos lead to hand and fullHand being overwritten.)
        trailingPeg: pegPos.trailingPeg,
        score: pegPos.score,
    };
}

export function newDealData(
    pegPos: PlayerPegPositions,
    shuffle: (arr: Card[]) => Card[], 
): Omit<ServerData, keyof RequiredServerData> {
    const cards = shuffle(deck());

    return {
        player0: playerData(cards, pegPos.player0),
        player1: playerData(cards, pegPos.player1),

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
    const startingPegPos : PlayerPegPositions = {
        player0: {
            score: 0,
            trailingPeg: -1,
        },
        player1: {
            score: 0,
            trailingPeg: -1,
        },
    };

    return {
        ...newDealData(startingPegPos, shuffle),
        ...startingRequiredState(),
    };
}
