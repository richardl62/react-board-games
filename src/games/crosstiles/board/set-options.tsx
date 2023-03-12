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

function parseRestrictedInt(str: string, low?: number, high?: number) : number {
    let val = parseInt(str);
    if(isNaN(val)) {
        // KLUDGE? Setting a non-null value allows the high/low testes below// apply
        val = 0; 
    }

    if(low !== undefined && val < low) {
        return low;
    }
    if(high !== undefined && val > high) {
        return high;
    }

    return val;
}

interface NumericOption {
    value: number;
    setValue: (arg: number) => void;
    label: string;
    min?: number;
    max?: number;
}

function SetNumericValue(props: NumericOption) {
    const { value, setValue, label, min, max } = props;

    const minMaxText = () => {

        if (min === undefined && max === undefined) {
            return "";
        }

        let txt;
        if ( min === undefined ) {
            txt = `<=${max}`;
        } else if ( max === undefined ) {
            txt = `>=${min}`;
        } else {
            txt = `${min}-${max}`;
        }
        
        return `[${txt}] `;
    }; 

    return <label>
        {label+" "+minMaxText()}
        <input
            type="number"
            defaultValue={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = parseRestrictedInt(e.target.value, min, max);
                setValue(value);
            }}
            min={min}
            max={max}
        />
    </label>;
}

function SetOptions(props: SetOptionsProps) {
    const { gameProps: {moves, G} } = props;

    const [options, setOptions] = useState(G.options);

    // To do. Think about simplifying this code, in particular
    // reducing the amount of ccopy and paste.
    return <SetOptionsDiv>
        <br/>
        <SetNumericValue
            label="Time to make grid"
            value={options.timeToMakeGrid}
            setValue={(value: number) => setOptions({...options, timeToMakeGrid: value} )}
        />

        <SetNumericValue
            label="Make grid countdown"
            value={options.makeGridCountdown}
            setValue={(value: number) => setOptions({...options, makeGridCountdown: value} )}
        />

        <SetNumericValue
            label="Rack size"
            value={options.rackSize}
            min={6}
            max={8}
            setValue={(value: number) => setOptions({...options, rackSize: value} )}
        />

        <SetNumericValue
            label="Min vowels"
            value={options.minVowels}
            min={0}
            max={2}
            setValue={(value: number) => setOptions({...options, minVowels: value} )}
        />

        <SetNumericValue
            label="Min consonsants"
            value={options.minConsonants}
            min={0}
            max={4}
            setValue={(value: number) => setOptions({...options, minConsonants: value} )}
        />
        

        <SetNumericValue
            label="Min bonus letters"
            value={options.minBonusLetters}
            min={0}
            max={2}
            setValue={(value: number) => setOptions({...options, minBonusLetters: value} )}
        />

        <label>{"Players get same letters "}
            <input type="checkbox" checked={options.playersGetSameLetters}
                onChange={() => setOptions({...options, playersGetSameLetters: !options.playersGetSameLetters})}
            />
        </label>

        <label>{"Warn when recording non-scoring grid "}
            <input type="checkbox" checked={options.checkGridBeforeRecoding}
                onChange={() => setOptions({...options, checkGridBeforeRecoding: !options.checkGridBeforeRecoding})} 
            />
        </label>

        <label>{"Suppress spelling checks (debug) "}
            <input type="checkbox" checked={!options.checkSpelling}
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