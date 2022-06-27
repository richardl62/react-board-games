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

function SetOptions(props: SetOptionsProps) {
    const { gameProps: {moves, G} } = props;

    const [options, setOptions] = useState(G.options);

    const onChangeTimeToMakeGrid = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setOptions({...options, timeToMakeGrid: value} );
    };

    return <SetOptionsDiv>
        <label>{"Time to make grid "}
            <input 
                type="number" 
                defaultValue={`${options.timeToMakeGrid}`}
                min={"1"}
                onChange={onChangeTimeToMakeGrid}
            />
        </label>

        <label>{"Players get same letters "}
            <input type="checkbox" checked={options.playersGetSameLetters}
                onChange={() => setOptions({...options, playersGetSameLetters: !options.playersGetSameLetters})}
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