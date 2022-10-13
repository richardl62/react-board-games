import React from "react";
import { CardSetID } from "../server-side/server-data";
import { Hand } from "./hand";

interface HandWrapperProps {
    cardSetID: CardSetID;
}

export function HandWrapper(props: HandWrapperProps) : JSX.Element {
    const { cardSetID } = props;
    return <Hand cardSetID={cardSetID} />;
}

