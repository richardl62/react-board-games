import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

const SetOptionsDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

function SetOptions() {
    const context = useCrossTilesContext();
    const [checkSpelling, setCheckSpelling] = useState(context.options.checkSpelling);
    const [timeToMakeGrid, setTimeToMakeGrid] = useState(context.options.timeToMakeGrid);

    const { moves } = context.wrappedGameProps;
    
    

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

        <label>{"Check spelling (debug) "}
            <input type="checkbox" checked={checkSpelling}
                onChange={() => setCheckSpelling(!checkSpelling)} 
            />
        </label>

        <button onClick={() => moves.setOptions({checkSpelling, timeToMakeGrid})}>Set Options</button>
    </SetOptionsDiv>;
}

export function SetOptionsOrWait() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { playerID, getPlayerName, ctx } = context.wrappedGameProps;

    if(stage !== GameStage.settingOptions) {
        return null;
    }

    const firstPlayer = ctx.playOrder[0];
    if(playerID === firstPlayer) {
        return <SetOptions />;
    }

    return <div>{`Waiting for ${getPlayerName(firstPlayer)} to set options`}</div>;
}