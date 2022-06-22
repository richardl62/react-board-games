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

    const [checkSpelling, setCheckSpelling] = useState(G.options.checkSpelling);
    const [timeToMakeGrid, setTimeToMakeGrid] = useState(G.options.timeToMakeGrid);

    const onChangeTimeToMakeGrid = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setTimeToMakeGrid(value );
    };

    return <SetOptionsDiv>
        <label>{"Time to make grid "}
            <input 
                type="number" 
                defaultValue={`${timeToMakeGrid}`}
                min={"1"}
                onChange={onChangeTimeToMakeGrid}
            />
        </label>

        <label>{"Check spelling "}
            <input type="checkbox" checked={checkSpelling}
                onChange={() => setCheckSpelling(!checkSpelling)} 
            />
        </label>

        <button onClick={() => moves.setOptions({checkSpelling, timeToMakeGrid})}>Set Options</button>
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