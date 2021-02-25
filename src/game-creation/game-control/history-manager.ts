class HistoryManager<State> {
    private _states: Array<State>;
    private _stateIndex: number;

    constructor(initialState: State) {
        this._states = [initialState];
        this._stateIndex = 0;
    }

    get canUndo() : boolean {return this._stateIndex > 0;}
    get canRedo() : boolean {return this._stateIndex + 1 < this._states.length;}

    get state() :State {return this._states[this._stateIndex];}

    undo(): State {
        if(!this.canUndo) {
            throw new Error("HistoryManager Cannot undo")
        }
        --this._stateIndex;
        return this.state;
    }

    redo() : State {
        if(!this.canRedo) {
            throw new Error("HistoryManager Cannot redo")
        }
        ++this._stateIndex;
        return this.state;
    }

    restart() : State {
        this._stateIndex = 0;
        return this.state;
    }

    setState(changeState: Partial<State>) : void {
        // Remove states afters the current state
        this._states = this._states.slice(0, this._stateIndex+1);

        // Add a new complete state
        this._states.push({...this.state, ...changeState});
        ++this._stateIndex;
    }
}

export default HistoryManager;