import React from "react";

interface Props {
    playerID: string;
}

export function Discards(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    return <div>{"DiscardPiles " + inputPlayerID}</div>;
}
