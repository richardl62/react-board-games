import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../cribbage-context";
import { Hand } from "./hand";


const GameArea = styled.div`
`;

export function Cribbage() : JSX.Element {
    const {me, other } = useCribbageContext();

    return <GameArea>
        
        <Hand cards={other.hand} showBack />
        <MidTable/>
        <Hand cards={me.hand} />
        
    </GameArea>;
}

function MidTable() {
    const context = useCribbageContext();

    if(context.settingBox) {
        return <Hand cards={context.settingBox.inBox} showBack />;
    }

    return <div>Error: Did not find expected data</div>;
}