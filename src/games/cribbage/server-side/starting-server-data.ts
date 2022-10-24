import { Ctx } from "boardgame.io";
import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage, PegPositions, PlayerData } from "./server-data";

interface PlayerPegPositions {
    player0: PegPositions;
    player1: PegPositions;
}

export function newDealData(ctx: Ctx, pegPos: PlayerPegPositions): Omit<ServerData, "serverError" | "serverTimestamp"> {

    const cards = deck(ctx, { jokers: false, shuffled: true });

    const playerData = (pegPos: PegPositions) : PlayerData => {
        const hand = cards.splice(0, cardsPerHand);
        return {
            hand,
            fullHand: [...hand],
            ...pegPos,
            doneSettingBox: false,
            restartPeggingRequested: false,
            revealHandsRequested: false,
            newDealRequested: false,
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

export function startingServerData(ctx: Ctx): ServerData {
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
        ...newDealData(ctx, startingPegPos),
        serverError: null,
        serverTimestamp: 0,
    };
}
