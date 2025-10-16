import { cardsPerHand } from "@/app-games/cribbage/config";
import { SetupArg0 } from "@/game-controlX/game-control";
import { RandomAPI } from "@/game-controlX/random-api";
import { RequiredServerData, startingRequiredState } from "@/game-controlX/required-server-data";
import { Card } from "@/utils/cards";
import { deckNoJokers } from "@/utils/cards/deck";
import { GameStage, PegPositions, PlayerData, ServerData } from "./server-data";

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
    random: RandomAPI, 
): Omit<ServerData, keyof RequiredServerData> {
    const cards = random.Shuffle(deckNoJokers());

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

export function startingServerData({ random }: SetupArg0): ServerData {
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
        ...newDealData(startingPegPos, random),
        ...startingRequiredState(),
    };
}
