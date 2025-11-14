import { WebSocket  } from 'ws'; // Import the ws library
import { PublicPlayerMetadata } from '../shared/lobby/types.js';
import { sAssert } from '../shared/utils/assert.js';

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
        this.credentials = 'c' + this.id; // for now
        
        this.name = null;
        this.ws = null;
    }

    readonly id: string;
    readonly credentials: string;

    private name: string | null;
    private ws: WebSocket | null;


    /** Permanently allocate this player (see class comment) */
    allocate(name: string) {
        sAssert(!this.isAllocated, "Player is already allocated");
        this.name = name; 
    }

    changeName(name: string) {
        sAssert(this.isAllocated, "Attempt to set name of unallocated player");
        this.name = name;
    }

    get isAllocated() { return this.name !== null; }

    connect(ws: WebSocket) {
        sAssert(this.isAllocated, "Attempt to connect unallocated player");
        sAssert(!this.isConnected, "Attempt to connect player who is already connected");
        this.ws = ws;
    }

    disconnect() {
        sAssert(this.isConnected, "Attempt to disconnect player who is not connected");
        this.ws = null;
    }

    get isConnected() {return this.ws !== null; } 
    
    getWs() : WebSocket | null {
        return this.ws;
    }

    publicMetadata(): PublicPlayerMetadata {
        const { name, isConnected } = this;

        return  { 
            id: this.id,
            name, 
            isConnected 
        };
    }
}
