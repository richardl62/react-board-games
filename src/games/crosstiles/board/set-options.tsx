import React, { useState } from "react";
import styled from "styled-components";
import { SetBooleanOption, SetNumericOption } from "../../../app-game-support/options/set-option";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";

const SetOptionsDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

interface SetOptionsProps {
    gameProps: CrossTilesGameProps;
} 

function SetOptions(props: SetOptionsProps) {
    const { gameProps: {moves, G} } = props;

    const [gameOptions, setGameOptions] = useState(G.options);

    const doSetGameOptions = (arg: {[key:string] : boolean|number}) =>  {
        setGameOptions(arg as typeof gameOptions);
    };

    // To do. Think about simplifying this code, in particular
    // reducing the amount of ccopy and paste.
    return <SetOptionsDiv>
        <SetNumericOption
            label="Time to make grid"
            optionName="timeToMakeGrid"

            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetNumericOption
            label="Make grid countdown"
            optionName="makeGridCountdown"

            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetNumericOption
            label="Rack size"
            optionName="rackSize"
            min={6}
            max={8}
            
            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetNumericOption
            label="Min vowels"
            optionName="minVowels"
            min={0}
            max={2}
            
            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetNumericOption
            label="Min consonsants"
            optionName="minConsonants"
            min={0}
            max={4}
            
            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetNumericOption
            label="Min bonus letters"
            optionName="minBonusLetters"
            min={0}
            max={2}
            
            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetBooleanOption
            label="Players get same letters"
            optionName="playersGetSameLetters"

            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetBooleanOption
            label="Warn when recording non-scoring grid"
            optionName="checkGridBeforeRecoding"

            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <SetBooleanOption
            label="Suppress spelling checks (debug)"
            optionName="checkSpelling"

            options={gameOptions}
            setOptions={doSetGameOptions}
        />

        <button onClick={() => moves.setOptions(gameOptions)}>Set Options</button>
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