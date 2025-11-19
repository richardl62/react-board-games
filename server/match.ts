import { WebSocket } from 'ws';
import { ServerCtx } from '../shared/game-control/ctx.js';
import { GameControl } from "../shared/game-control/game-control.js";
import { MoveArg0 } from '../shared/game-control/move-fn.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { WsMoveRequest } from "../shared/ws-match-request.js";
import { ServerMatchData } from "../shared/ws-match-response.js";
import { Player } from "./player.js";
import { matchMove } from '../shared/game-control/match-move.js';

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
        { id, numPlayers, setupData, randomAPi }: {
            id: number,
            numPlayers: number,
            setupData: unknown,
            randomAPi: RandomAPI,
        }
    ) {
        this.definition = gameControl;
        this.id = id;
        this.random = randomAPi;


        this.ctx = new ServerCtx(numPlayers);
        
        this.players = [];
        for (let id = 0; id < numPlayers; ++id) {
            this.players[id] = new Player(this.ctx.playOrder[id]);
        }


        this.state = gameControl.setup(
            { ctx: this.ctx, random: randomAPi },
            setupData
        );
    }

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

    move(request: WsMoveRequest) {

        const { move, arg } = request;

        const endTurn = () => this.endTurn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arg0: MoveArg0<any> = {
            G: this.state,
            ctx: this.ctx,
            playerID: this.currentPlayer.toString(),
            random: this.random,
            events: { endTurn },
        }

        const moveResult = matchMove(this.definition, move, arg0, arg);
        if (typeof moveResult !== "undefined") {
            this.state = moveResult;
        }
    }

    endTurn() {
        this.ctx.endTurn();
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
