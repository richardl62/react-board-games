import React from "react";
import { boxFull } from "../client-side/context-tools";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameStage } from "../server-side/server-data";
import { OuterDiv } from "./message-and-button";

export function MakingBox() : JSX.Element | null {
    const context = useCribbageContext();
    const { me,  moves, stage } = context;

    if (stage !== GameStage.SettingBox) {
        return null;
    }

    const doneMakingBox = () => moves.doneMakingBox();
    const full = boxFull(context, me);
    return <OuterDiv>
        <span>Add cards to box</span>
        {full && <button onClick={doneMakingBox}>Confirm</button>}
    </OuterDiv>;
}
