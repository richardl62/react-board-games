import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";

const SetOptionsDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

interface SetOptionsProps {
    gameProps: CrossTilesGameProps;
} 

function parseRestrictedInt(str: string, low: number, high: number) : number {
    const val = parseInt(str);
    if(isNaN(val)) {
        return low; // arbitary.
    }
    if(val < low) {
        return low;
    }
    if(val > high) {
        return high;
    }

    return val;
}

function SetOptions(props: SetOptionsProps) {
    const { gameProps: {moves, G} } = props;

    const [options, setOptions] = useState(G.options);

    // To do. Think about simplifying this code, in particular
    // reducing the amount of ccopy and paste.
    return <SetOptionsDiv>
        <div>*** Under development ***</div>
        <br/>
        <label>{"Time to make grid "}
            <input 
                type="number" 
                defaultValue={options.timeToMakeGrid}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                    const value = parseRestrictedInt(e.target.value,1,9999);
                    setOptions({...options, timeToMakeGrid: value} );
                }}
            />
        </label>

        <label>{"Rack size [6-8] "}
            <input 
                type="number" 
                min={6}
                max={8}
                defaultValue={options.rackSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                    const value = parseRestrictedInt(e.target.value, 6, 8);
                    setOptions({...options, rackSize: value} );
                }}
            />
        </label>

        <label>{"Min vowels [0-2] "}
            <input 
                type="number"
                min={0}
                max={2} 
                defaultValue={options.minVowels}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                    const value = parseRestrictedInt(e.target.value, 0, 2);
                    setOptions({...options, minVowels: value} );
                }}
            />
        </label>

        
        <label>{"Min consonsants [0-4] "}
            <input 
                type="number"
                min={0}
                max={4}  
                defaultValue={options.minConsonants}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                    const value = parseRestrictedInt(e.target.value, 0, 4);
                    setOptions({...options, minConsonants: value} );
                }}
            />
        </label>

        <label>{"Players get same letters "}
            <input type="checkbox" checked={options.playersGetSameLetters}
                onChange={() => setOptions({...options, playersGetSameLetters: !options.playersGetSameLetters})}
            />
        </label>

        <label>{"Show status while making grids "}
            <input type="checkbox" checked={options.showStatusWhileMakingGrid}
                onChange={() => setOptions({...options, showStatusWhileMakingGrid: !options.showStatusWhileMakingGrid})} 
            />
        </label>


        <label>{"Check spelling "}
            <input type="checkbox" checked={options.checkSpelling}
                onChange={() => setOptions({...options, checkSpelling: !options.checkSpelling})} 
            />
        </label>


        <button onClick={() => moves.setOptions(options)}>Set Options</button>
    </SetOptionsDiv>;
}


export function SetOptionsOrWait(props: SetOptionsProps) : JSX.Element | null {

    const { gameProps } = props;
    const { stage } = gameProps.G;
    const { playerID, getPlayerName, ctx } = gameProps;

    if(stage !== GameStage.setup) {
        return null;
    }

    const firstPlayer = ctx.playOrder[0];
    if(playerID === firstPlayer) {
        return <SetOptions gameProps={gameProps} />;
    }

    return <div>{`Waiting for ${getPlayerName(firstPlayer)} to set options`}</div>;
}