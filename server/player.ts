import { WebSocket  } from 'ws'; // Import the ws library
import { PublicPlayerMetadata } from '../shared/lobby/types.js';
import { sAssert } from '../shared/utils/assert.js';
import { createAlphanumericString } from '../shared/utils/random-string.js';
import { WsServerResponse } from '../shared/ws-server-response.js';

// Put loosely, a Player represents someone sitting around the table at which
// a match is being played.
// 
// Initially, the seats are occupied by 'ghost' players. When a real player
// joins they take over the seat allocated to a ghost.  The seat then remains 
// allocated to that player even if they (temporarily, we hope) leave the table.  
//
// A real Player is indcated by the name being set or, equivalently, 
// by isAllocated. The name of a player can change after allocation but it
// will always remain set, and must always be unique within a match. (Names need not
// be globally unique.) 
//
// A connected Player (i.e. one who is currently at their seat in the analogy above), 
// is indicated by the websocket being set or, equivalently, by isConnected.  
//
// If an allocated Player is not connected, this could indicate a network problem, 
// or that the browser running the relevant client was shut. In general, it should 
// be possible for a client to re-establish a lost connection. 
//
export class Player {
    
     constructor(id: string) {
        this.id = id;

        this.credentials = createAlphanumericString(8);
        
        this.name_ = null;
        this.ws = null;
    }

    readonly id: string;
    readonly credentials: string;

    private name_: string | null;
    private ws: WebSocket | null;

    get name() : string | null { return this.name_ }

    /** Permanently allocate this player (see class comment) */
    allocate(name: string) {
        sAssert(!this.isAllocated, "Player is already allocated");
        this.name_ = name; 
    }

    changeName(name: string) {
        sAssert(this.isAllocated, "Attempt to set name of unallocated player");
        this.name_ = name;
    }

    get isAllocated() { return this.name_ !== null; }

    recordConnection(ws: WebSocket) {
        sAssert(this.isAllocated, "Attempt to connect unallocated player");
        sAssert(!this.isConnected, "Attempt to connect player who is already connected");
        this.ws = ws;
    }

    recordDisconnection() {
        sAssert(this.isConnected, "Attempt to disconnect player who is not connected");
        this.ws = null;
    }

    get isConnected() {return this.ws !== null; } 
    
    getWs() : WebSocket {
        if (!this.ws) {
            throw new Error(`Player ${this.id} is not connected: cannot get WebSocket`);
        }
        return this.ws;
    }

    sendServerResponse(response: WsServerResponse) {
        if (this.ws) {
            this.ws.send(JSON.stringify(response));
        } else {
            console.warn(`Attempt to send server response to disconnected player ${this.id}`);
        }
    }

    publicMetadata(): PublicPlayerMetadata {
        const { name_: name, isConnected } = this;

        return  { 
            id: this.id,
            name, 
            isConnected 
        };
    }
}
