import React from "react";
import { useGameContext } from "../client-side/game-context";
import { CardWithText } from "./card-with-text";

interface Props {
    playerID: string;
}

export function MainPile(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { mainPile } = playerData[inputPlayerID];
    const message = `${mainPile.length} cards`;
    return <CardWithText card={mainPile[0]} text={message} />;
}
