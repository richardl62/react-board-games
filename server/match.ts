import { WebSocket } from 'ws';
import { CtxData, makeServerCtx, ServerCtx } from '../shared/game-control/ctx.js';
import { GameControl } from "../shared/game-control/game-control.js";
import { MoveArg0 } from '../shared/game-control/move-fn.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { WsMove } from "../shared/ws-client-request.js";
import { ServerMatchData } from "../shared/server-match-data.js";
import { Player } from "./player.js";
import { matchMove } from '../shared/game-control/match-move.js';
import { EventsAPI } from '../shared/game-control/events.js';
import { RequiredServerData } from '../shared/game-control/required-server-data.js';

// A match is an instance of a game.
export class Match {
    readonly definition: GameControl;
    readonly matchID: string;

    readonly players: Player[];
    readonly random: RandomAPI;

    // The data that can change during the course of a match.
    private matchData : {
        ctxData: CtxData;

        // KLUDGE?: state will record more than just RequiredServerData.
        state: RequiredServerData;

        // Error message from the last move attempted.
        moveError: string | null;
    }

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
                   
        const ctx = makeServerCtx(numPlayers);

        this.players = [];
        for (let id = 0; id < numPlayers; ++id) {
            this.players[id] = new Player(ctx.playOrder[id]);
        }

        const state = gameControl.setup(
            { ctx, random: randomAPi },
            setupData
        );

        this.matchData = {
            ctxData: ctx.data,
            state,
            moveError: null,
        };
    }

    get ctx() { return new ServerCtx(this.matchData.ctxData); }

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

    publicMatchData(): ServerMatchData {
        return {
            playerData: this.players.map(p => p.publicMetadata()),
            ctxData: this.ctx.data,
            state: this.matchData.state,
            moveError: this.matchData.moveError,
        };
    }

    move(request: WsMove, playerID: string) {
        try {
            const { move, arg } = request;

            const newMatchData = structuredClone(this.matchData);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const arg0: MoveArg0<any> = {
                G: newMatchData.state,
                ctx: this.ctx,
                random: this.random,
                events: this.events,

                playerID,
            };

            matchMove(this.definition, move, arg0, arg);
            this.matchData = newMatchData;
            this.matchData.moveError = null;
            
        } catch (error) {
            this.matchData.moveError = error instanceof Error ? error.message :
                "unknown error during move";
        }
    }

    get events (): EventsAPI {
        return {
            endTurn: () => { this.ctx.endTurn(); },
            endMatch: () => { this.ctx.endMatch(); }
        };
    }

    findPlayer(arg: {id: string} | {name: string} | {ws: WebSocket}): Player | undefined {
        if ('id' in arg) {
            return this.players.find(p => p.id === arg.id);
        } else if ('name' in arg) {
            return this.players.find(p => p.name === arg.name);
        } else {    
            return this.players.find(p => p.getWs() === arg.ws);
        }
    }
};  
