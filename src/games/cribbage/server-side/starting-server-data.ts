import { Ctx } from "boardgame.io";
import { Card } from "../../../utils/cards";
import { deck } from "../../../utils/cards/deck";
import { cardsPerHand } from "../config";
import { ServerData, GameStage, PegPositions, PlayerData } from "./server-data";

interface PlayerPegPositions {
    player0: PegPositions;
    player1: PegPositions;
}


function playerData(cards: Card[], pegPos: PegPositions): PlayerData {
    const hand = cards.splice(0, cardsPerHand);
    const pd : PlayerData = {
        hand,
        fullHand: [...hand],
        ...pegPos,
        request: null,
    };


    // Setting hand and fullHand below fixes a bug I don't understand.
    // The symptom is that hand and fullHand had the wrong length as shown by
    // following console.log.
    console.log("hand", hand.length, "pd.hand", pd.hand.length, "pd.fullHand", pd.fullHand.length);

    pd.hand = [...hand];
    pd.fullHand = [...hand];

    return pd;
}

export function newDealData(ctx: Ctx, pegPos: PlayerPegPositions): Omit<ServerData, "serverError" | "serverTimestamp"> {

    const cards = deck(ctx, { jokers: false, shuffled: true });

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
