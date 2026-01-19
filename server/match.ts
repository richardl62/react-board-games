import { WebSocket } from 'ws';
import { EventsAPI } from '../shared/game-control/events.js';
import { GameControl } from "../shared/game-control/game-control.js";
import { matchMove } from '../shared/game-control/match-action.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { MutableMatchData, ServerMatchData } from "../shared/server-match-data.js";
import { RandomAPI } from '../shared/utils/random-api.js';
import { WsMove } from "../shared/ws-client-request.js";
import { Player } from "./player.js";
import { Ctx, endMatch, endTurn, makeCtxData } from '../shared/game-control/ctx.js';
import { WsResponseTrigger } from '../shared/ws-response-trigger.js';
import { WsServerResponse } from '../shared/ws-server-response.js';
import { sendServerResponse } from './web-socket-actions.js';

// A match is an instance of a game.
export class Match {
    readonly definition: GameControl;
    readonly matchID: string;

    readonly players: Player[];
    readonly random: RandomAPI;

    // The data that can change during the course of a match.
    private mutableData : MutableMatchData

    constructor(
        gameControl: GameControl,
        {  matchID, numPlayers, setupData, randomAPi }: {
            matchID: string,
            numPlayers: number,
            setupData: unknown,
            randomAPi: RandomAPI,
        }
    ) {
        this.definition = gameControl;
        this.matchID = matchID;
        this.random = randomAPi;
                   
        const ctxData = makeCtxData(numPlayers);
        const ctx = new Ctx(ctxData);

        this.players = [];
        for (let id = 0; id < numPlayers; ++id) {
            this.players[id] = new Player(ctx.playOrder[id]);
        }

        const state = gameControl.setup(
            { ctx, random: randomAPi },
            setupData
        );

        this.mutableData = {
            ctxData,
            state,
        };
    }

    get ctx() { return new Ctx(this.mutableData.ctxData); }

    get gameName() { return this.definition.name }

    get currentPlayer() { return parseInt(this.ctx.currentPlayer) };
    // set currentPlayer(cp: number) { this.ctx.currentPlayer = cp.toString() };

    allocatePlayer(name: string): Player {
        const player = this.players.find(p => !p.isAllocated);
        if (!player) {
            throw new Error("No unallocated player found");
        }

        if ( this.findPlayer({ name }) ) {
            throw new Error(`player name "${name}" already in use`);
        }

        player.allocate(name);

        return player;
    }

    lobbyMatch(): LobbyTypes.Match {
        return {
            gameName: this.definition.name,
            matchID: this.matchID,
            players: this.players.map(p => p.publicMetadata()),
        }
    }

    matchData(): ServerMatchData {
        return {
            ...this.mutableData,
            playerData: this.players.map(p => p.publicMetadata()),
        };
    }

    move(request: WsMove, playerID: string) {
        const { move, arg } = request;
        this.doSafeAction(md => matchMove(this.definition, move, this.random, playerID, md, arg));
    }

    get events (): EventsAPI {
        return {
            endTurn: () => this.doSafeAction(md => endTurn(md.ctxData)),
            endMatch: () => this.doSafeAction(md => endMatch(md.ctxData)),
        };
    }

    findPlayer(arg: {id: string} | {name: string} | {ws: WebSocket}): Player | undefined {
        if ('id' in arg) {
            return this.players.find(p => p.id === arg.id);
        } else if ('name' in arg) {
            return this.players.find(p => p.name === arg.name);
        } else {    
            return this.players.find(p => p.isConnected && p.getWs() === arg.ws);
        }
    }

    // Perform an action making sure that mutable data is not changed if the action throws.
    doSafeAction(action: (md: MutableMatchData) => void) {
        const md = structuredClone(this.mutableData);
        action(md);
        this.mutableData = md;
    }

    broadcastMatchData(
        trigger: WsResponseTrigger,
        errorInAction: string | null
    ) {
        const response: WsServerResponse =
            { trigger, matchData: this.matchData(), errorInAction };

        for (const player of this.players) {
            if (player.isConnected) {
                sendServerResponse(player.getWs(), response);
            }
        }
    }
}  
