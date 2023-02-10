import React from "react";

interface Props {
    playerID: string;
}

export function MainPile(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    return <div>{"MainPile " + inputPlayerID}</div>;
}
