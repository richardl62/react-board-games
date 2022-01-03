import React from "react";
import styled from "styled-components";
import { CardSVG } from "./card";


const CardDisplay = styled.div`
`;

export function CardGame() : JSX.Element {
    return <CardDisplay>
        <CardSVG card={{rank: "A", suit: "S"}} />
        <CardSVG card={{rank: "A", suit: "H"}} />
        <CardSVG showBack={true} />
        <CardSVG showBack={"red"} />
        <CardSVG card={{rank: "A", suit: "H"}} showBack={"black"} />
    </CardDisplay>;
}
