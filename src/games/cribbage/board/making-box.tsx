import { JSX } from "react";
import { boxFull } from "../client-side/context-tools";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameRequest, GameStage } from "../server-side/server-data";
import { OuterDiv } from "./message-and-button";

export function MakingBox() : JSX.Element | null {
    const context = useCribbageContext();
    const { me,  moves, stage } = context;

    if (stage !== GameStage.SettingBox) {
        return null;
    }

    const doneMakingBox = () => moves.doneMakingBox(me);
    const full = boxFull(context, me);
    const done = context[me].request === GameRequest.FinishSettingBox;
    return <OuterDiv>
        <span>Add cards to box</span>
        {full &&
            <button
                onClick={doneMakingBox}
                disabled={done}
            >
                Confirm
            </button>
        }
    </OuterDiv>;
}
