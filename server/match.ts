import { WebSocket } from 'ws';
import { GameControl } from "../shared/game-control/game-control.js";
import { Player } from "./player.js";
import { Ctx } from '../shared/game-control/ctx.js';
import { random } from '../shared/game-control/random-api.js';
import * as LobbyTypes from '../shared/lobby/types.js';

// A match is an instance of a game.
export class Match {
    readonly definition: GameControl;
    readonly id: number;
    readonly players: Player[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private state: any;
    private ctx: Ctx

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
    }

    get gameName() {return this.definition.name}

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
    
    // Simplified move function
    move(_name: string, _activePlayer: number, _arg: unknown) {
        console.log("Move called with state", this.state);
        throw new Error("Move not implemented");
        // let error: string | null = null;

        // try {
        //     const move = this.definition.moves[name];
        //     if (!move) {
        //         throw new Error(`Unknown move: ${name}`);
        //     }

        //     const { currentPlayer, state } = this;
        //     if (activePlayer !== currentPlayer) {
        //         // Can this happen without a bug if the client code? If not,
        //         // is this test worth having? For the time being I regard it as a
        //         // sanity check.
        //         throw new Error("Illegal move - wrong player");
        //     }

        //     this.state = move({ state, currentPlayer, activePlayer, arg });

        //     // currentPlayer should not be changed if an error has been throws.
        //     this.currentPlayer += 1;
        //     if (this.currentPlayer == this.players.length) {
        //         this.currentPlayer = 0;
        //     }

        // } catch (err) {
        //     error = err instanceof Error ? err.message : "unknown error";
        // }

        // this.broadcastMatchData({error});
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

    private broadcastMatchData(/*{error}*/ _data : {error : string | null}) {
        throw new Error("Not implemented");
        // const matchData : ServerMatchData = {
        //     playerData: this.players.map(p => p.publicMetada()),
        //     currentPlayer: 0,
        //     state: this.state,
        // };
        
        // const response: ServerMoveResponse = { matchData, error };

        // for (const player of this.players) {
        //     if( player.ws ) {
        //         player.ws.send(JSON.stringify(response));
        //     }
        // }
    }
};  