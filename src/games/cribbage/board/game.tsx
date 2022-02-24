import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCribbageContext } from "../cribbage-context";
import { Deck } from "./deck";
import { Hand } from "./hand";
import { Scores } from "./scores";


const GameArea = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }
`;

export function Cribbage() : JSX.Element {
    const context = useCribbageContext();

    return <GameArea>
        <Deck/>

        {context.settingBox && <SettingBox/>}
          
        <Scores/>
        
    </GameArea>;
}

function SettingBox() {
    const {me, other, settingBox } = useCribbageContext();
    sAssert(settingBox);

    return <div>
        <Hand cards={other.hand} showBack />
        <Hand cards={settingBox.inBox} showBack />
        <Hand cards={me.hand} />
    </div>;

}