import React, { useEffect, useReducer, useState } from "react";
import { Board } from ".";
import { ScrabbleGameProps } from "../client-side/srcabble-game-props";
import { initialReducerState } from "../client-side/reducer-state";
import { scrabbleReducer } from "../client-side/scrabble-reducer";
import { ScrabbleConfig } from "../config";
import { makeScrabbleContext, ReactScrabbleContext } from "../client-side/scrabble-context";
import { isScrabbleConfig } from "../config/scrabble-config";
import { sAssert } from "../../../utils/assert";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { Trie } from "../../../utils/word-finder/trie";

// import { beep } from "./sounds";

export interface BoardWrapperProps {
    customData: unknown,
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const config = props.customData as ScrabbleConfig;
    sAssert(isScrabbleConfig(config), "Invalid Srabble context");

    const scrabbleGameProps = useStandardBoardContext() as ScrabbleGameProps;

    const [reducerState, dispatch] = useReducer(scrabbleReducer, 
        initialReducerState(scrabbleGameProps, config)
    );

    const downHandler = (event: KeyboardEvent) => 
        dispatch({ type: "keydown", data: {key: event.key}});

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    const [trie, setTrie] = useState<Trie|null>(null);
    const [loadError, setLoadError] = useState<Error|null>(null);
    
    useEffect(()=>{
        config.getLegalWords().then(
            legalWords => setTrie(new Trie(legalWords.map(w => w.toUpperCase())))
        ).catch(setLoadError);
    }, []);

    if(loadError) {
        return <div>ERROR: Cannot load dictionary ({loadError.message})</div>;
    }

    if(!trie) {
        return <div>Loading dictionary...</div>;
    }

    if (scrabbleGameProps.G.moveCount !== reducerState.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: scrabbleGameProps,
        });

        // if(localState.soundsAllowed) {
        //     beep();
        // }
    } 

    const context = makeScrabbleContext(scrabbleGameProps, config, reducerState, dispatch, trie);

    return <ReactScrabbleContext.Provider value={context}>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
