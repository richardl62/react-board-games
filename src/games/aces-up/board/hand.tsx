import React from "react";

interface Props {
    playerID: string;
}

export function Hand(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    return <div>{"Hand " + inputPlayerID}</div>;
}
