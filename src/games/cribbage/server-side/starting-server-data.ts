import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage, PegPositions, PlayerData } from "./server-data";

interface PlayerPegPositions {
    player0: PegPositions;
    player1: PegPositions;
}

export function newDealData(pegPos: PlayerPegPositions): Omit<ServerData, "serverError" | "serverTimestamp"> {

    const cards = deck({ jokers: false, shuffled: true });

    const playerData = (pegPos: PegPositions) : PlayerData => {
        const hand = cards.splice(0, cardsPerHand);
        return {
            hand,
            fullHand: [...hand],
            ...pegPos,
            doneSettingBox: false,
        };
    };

    return {
        player0: playerData(pegPos.player0),
        player1: playerData(pegPos.player1),

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
        ...newDealData(startingPegPos),
        serverError: null,
        serverTimestamp: 0,
    };
}
