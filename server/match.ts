import { WebSocket } from 'ws';
import { ServerCtx } from '../shared/game-control/ctx.js';
import { GameControl } from "../shared/game-control/game-control.js";
import { MoveArg0 } from '../shared/game-control/move-fn.js';
import { serverRandomAPI, RandomAPI } from '../shared/game-control/random-api.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { WsMoveRequest } from "../shared/ws-match-request.js";
import { ServerMatchData } from "../shared/ws-match-response.js";
import { Player } from "./player.js";

// A match is an instance of a game.
export class Match {
    readonly definition: GameControl;
    readonly id: number;
    readonly players: Player[];
    private ctx: ServerCtx;
    private random: RandomAPI;

    private state: unknown; // To do: pick a better name?

    constructor(
        gameControl: GameControl,
        { id, numPlayers, setupData }: {
            id: number,
            numPlayers: number,
            setupData: unknown
        }
    ) {
        this.definition = gameControl;
        this.id = id;

        this.ctx = new ServerCtx(numPlayers);
        
        this.players = [];
        for (let id = 0; id < numPlayers; ++id) {
            this.players[id] = new Player(this.ctx.playOrder[id]);
        }

        this.state = gameControl.setup(
            { ctx: this.ctx, random: serverRandomAPI },
            setupData
        );

        this.random = serverRandomAPI;
    }

    get gameName() { return this.definition.name }

    get currentPlayer() { return parseInt(this.ctx.currentPlayer) };
    // set currentPlayer(cp: number) { this.ctx.currentPlayer = cp.toString() };

    allocatePlayer(name: string): Player {
        const player = this.players.find(p => !p.isAllocated);
        if (!player) {
            throw new Error("No unallocated player found");
        }

        player.allocate(name);

        return player;
    }

    lobbyMatch(): LobbyTypes.Match {
        return {
            gameName: this.definition.name,
            matchID: this.id.toString(),
            players: this.players.map(p => p.publicMetadata()),
        }
    }

    matchData(): ServerMatchData {
        return {
            playerData: this.players.map(p => p.publicMetadata()),
            playOrder: this.ctx.playOrder,
            playOrderPos: this.ctx.playOrderPos,
            state: this.state,
        };
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
    }

    disconnectPlayer(ws: WebSocket): void {
        const player = this.findPlayerByWebSocket(ws);
        if (!player) {
            throw new Error("Disconnect report when player not connected");
        }

        player.disconnect();
    }

    move(request: WsMoveRequest) {

        const { move: moveName, arg } = request;
        const move = this.definition.moves[moveName];
        if (!move) {
            throw new Error(`Unknown move: ${moveName}`);
        }

        const endTurn = () => this.endTurn();

        const arg0: MoveArg0<unknown> = {
            G: this.state,
            ctx: this.ctx,
            playerID: this.currentPlayer.toString(),
            random: this.random,
            events: { endTurn },
        }

        const moveResult = move(arg0, arg);
        if (typeof moveResult !== "undefined") {
            this.state = moveResult;
        }
    }

    endTurn() {
        this.ctx.endTurn();
    }

    findPlayerByID(id: string): Player | null {
        for (const player of this.players) {
            if (player.id.toString() === id) {
                return player;
            }
        }

        return null;
    }

    findPlayerByWebSocket(ws: WebSocket): Player | null {
        for (const player of this.players) {
            if (player.getWs() === ws) {
                return player;
            }
        }

        return null;
    }
};  
