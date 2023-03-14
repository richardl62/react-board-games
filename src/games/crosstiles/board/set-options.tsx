import React, { useState } from "react";
import styled from "styled-components";
import { InputNumber } from "../../../app-game-support/value-specification/input-number";
import { InputBoolean } from "../../../app-game-support/value-specification/input-boolean";
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
        <InputNumber
            label="Time to make grid"
            valueName="timeToMakeGrid"

            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputNumber
            label="Make grid countdown"
            valueName="makeGridCountdown"

            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputNumber
            label="Rack size"
            valueName="rackSize"
            min={6}
            max={8}
            
            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputNumber
            label="Min vowels"
            valueName="minVowels"
            min={0}
            max={2}
            
            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputNumber
            label="Min consonsants"
            valueName="minConsonants"
            min={0}
            max={4}
            
            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputNumber
            label="Min bonus letters"
            valueName="minBonusLetters"
            min={0}
            max={2}
            
            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputBoolean
            label="Players get same letters"
            valueName="playersGetSameLetters"

            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputBoolean
            label="Warn when recording non-scoring grid"
            valueName="checkGridBeforeRecoding"

            values={gameOptions}
            setValues={doSetGameOptions}
        />

        <InputBoolean
            label="Suppress spelling checks (debug)"
            valueName="checkSpelling"

            values={gameOptions}
            setValues={doSetGameOptions}
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