import { WebSocket } from 'ws';
import { Ctx } from '../shared/game-control/ctx.js';
import { EventsAPI } from '../shared/game-control/events.js';
import { GameControl } from "../shared/game-control/game-control.js";
import { MoveArg0 } from '../shared/game-control/move-fn.js';
import { random, RandomAPI } from '../shared/game-control/random-api.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { WsMatchRequest } from "../shared/ws-match-request.js";
import { ServerMatchData, WsMatchResponse } from "../shared/ws-match-response.js";
import { Player } from "./player.js";

// A match is an instance of a game.
export class Match {
    readonly definition: GameControl;
    readonly id: number;
    readonly players: Player[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private state: any;
    private ctx: Ctx

    private random: RandomAPI;
    private events: EventsAPI;

    constructor(
        gameControl: GameControl, 
        {id, numPlayers, setupData}: {
            id: number, 
            numPlayers: number, 
            setupData: unknown
        }
    ) {
        this.definition = gameControl;
        this.id = id;

        this.players = [];
        const playOrder: string[] = [];
        // For legacy reasons players IDs are set to reflect their position
        // within the match.
        for(let id = 0; id < numPlayers; ++id) {
            this.players[id] = new Player(id);
            playOrder.push(id.toString());
        }

        this.ctx = {
            numPlayers: numPlayers,
            playOrder,

            //Kludge? Assume player 0 starts.
            currentPlayer: "0",
            playOrderPos: 0,
        };

        this.state = gameControl.setup(
            { ctx: this.ctx, random: random },
            setupData
        );

        this.random = random;

        this.events = {
            endTurn: () => {throw new Error("endTurn not implemented");},
            endGame: () => {throw new Error("endGame not implemented");},
        }
    }

    get gameName() {return this.definition.name}

    get currentPlayer() { return parseInt(this.ctx.currentPlayer)};
    set currentPlayer(cp: number) { this.ctx.currentPlayer = cp.toString()};

    allocatePlayer(name: string) : Player {
        const player = this.players.find(p => !p.isAllocated);
        if ( !player ) {
            throw new Error("No unallocated player found");
        }

        player.allocate(name);

        return player;
    }

    lobbyMatch() : LobbyTypes.Match {
        return {
            gameName: this.definition.name,
            matchID: this.id.toString(),
            players: this.players.map(p => p.publicMetada()),
        }
    }
    
    connectPlayer(id: string, ws: WebSocket) {
        const player = this.findPlayerByID(id);
        if (!player) {
            throw new Error(`Player ${id} not found - cannot record connection`);
        }

        if (player.isConnected) {
            throw new Error(`Player ${id} connected - cannot reconnect`);
        }

        player.connect(ws);
        this.broadcastMatchData({error: null});
    }

    disconnectPlayer(ws: WebSocket) : void {
        const player = this.findPlayerByWebSocket(ws);
        if (!player) {
            throw new Error("Disconnect report when player not connected");
        }
        
        player.disconnect();
        this.broadcastMatchData({error: null});
    }
    
    move(request: WsMatchRequest) {
        let error: string | null = null;

        try {
            const { move: moveName, arg } = request;
            const move = this.definition.moves[moveName];
            if (!move) {
                throw new Error(`Unknown move: ${moveName}`);
            }

            const arg0 : MoveArg0<unknown> = {
                    G: this.state,
                    ctx: this.ctx,
                    playerID: this.currentPlayer.toString(),
                    random: this.random,
                    events: this.events,
            }

            const moveResult = move(arg0, arg);
            if(typeof moveResult !== "undefined") {
                this.state = moveResult;
            }

            // currentPlayer should not be changed if an error has been throws.
            this.currentPlayer += 1;
            if (this.currentPlayer == this.players.length) {
                this.currentPlayer = 0;
            }

        } catch (err) {
            error = err instanceof Error ? err.message : "unknown error";
        }

        this.broadcastMatchData({error});
    }

    findPlayerByID(id: string) : Player | null {
        for (const player of this.players) {
            if ( player.id.toString() === id ) {
                return player;
            }
        }

        return null;
    }

    findPlayerByWebSocket(ws: WebSocket) : Player | null {
        for (const player of this.players) {
            if ( player.getWs() === ws ) {
                return player;
            }
        }

        return null;
    }

    private broadcastMatchData({error} : {error : string | null}) {

        const matchData : ServerMatchData = {
            playerData: this.players.map(p => p.publicMetada()),
            currentPlayer: this.currentPlayer,
            state: this.state,
        };
        
        const response: WsMatchResponse = { matchData, error };

        for (const player of this.players) {
            const ws = player.getWs();
            if( ws ) {
                ws.send(JSON.stringify(response));
            }
        }
    }
};  