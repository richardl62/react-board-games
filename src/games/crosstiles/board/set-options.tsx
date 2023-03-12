import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
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

interface NumericOption<Options> {    
    optionName: keyof Options;
    options: Options;
    setOptions: (arg: Options) => void;

    label: string;
    min?: number;
    max?: number;
}

function SetNumericOption<Options>(props: NumericOption<Options>) {
    const { options, setOptions, optionName, label, min, max } = props;

    const value = options[optionName];
    sAssert(typeof value === "number");

    const changeValue = (newValue: number) => {
        // Use 'any' to avoid typescript error due (I assume) to it's not
        // knowing that newOptions[optionName] is a number.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newOptions = {...options} as any;
        newOptions[optionName] = newValue;
        setOptions(newOptions);
    };

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
                const newValue = parseRestrictedInt(e.target.value, min, max);
                changeValue(newValue);
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
        <SetNumericOption
            label="Time to make grid"
            optionName="timeToMakeGrid"

            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Make grid countdown"
            optionName="makeGridCountdown"

            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Rack size"
            optionName="rackSize"
            min={6}
            max={8}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min vowels"
            optionName="minVowels"
            min={0}
            max={2}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min consonsants"
            optionName="minConsonants"
            min={0}
            max={4}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min bonus letters"
            optionName="minBonusLetters"
            min={0}
            max={2}
            
            options={options}
            setOptions={setOptions}
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