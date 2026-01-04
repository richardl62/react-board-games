import { JSX } from "react";
import { boxFull } from "../client-side/cribbage-state-tools";
import { useCribbageState } from "../client-side/cribbage-state";
import { GameRequest, GameStage } from "@game-control/games/cribbage/server-data";
import { OuterDiv } from "./message-and-button";

export function MakingBox() : JSX.Element | null {
    const context = useCribbageState();
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
