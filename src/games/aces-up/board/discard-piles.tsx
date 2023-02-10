import React from "react";

interface Props {
    playerID: string;
}

export function DiscardPiles(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    return <div>{"DiscardPiles " + inputPlayerID}</div>;
}
