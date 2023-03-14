import React from "react";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";
import { InputValues } from "../../../app-game-support/value-specification/input-values";
import { optionsSpecication } from "../options";

interface SetOptionsProps {
    gameProps: CrossTilesGameProps;
} 


export function SetOptionsOrWait(props: SetOptionsProps) : JSX.Element | null {

    const { gameProps } = props;
    const { stage } = gameProps.G;
    const { playerID, getPlayerName, ctx, moves } = gameProps;

    if(stage !== GameStage.setup) {
        return null;
    }

    const firstPlayer = ctx.playOrder[0];
    if(playerID === firstPlayer) {
        return <InputValues specification={optionsSpecication} setValues={moves.setOptions}/>;
    }

    return <div>{`Waiting for ${getPlayerName(firstPlayer)} to set options`}</div>;
}