interface State {[index: string]: any};

function compatibleSubState(sub: State, full:  State) {
    for(const key in sub) {
        if(sub[key] !== full[key]) {
            console.log(`sub[${key}] !== full[${key}]`, sub[key], full[key]);
            return false;
        } 
    }
    return true;
}

function equivalentState(state1:  State, state2:  State) {
    if(Object.keys(state1).length !== Object.keys(state2).length) {
        console.log("States have different keys", Object.keys(state1), Object.keys(state2));
        return false;
    }

    return compatibleSubState(state1, state2);
}

export {equivalentState};