import { JSX } from "react";
import { StandardMatchPlayProps, StandardMatchPlay } from "./standard-match-play";
import { TestOptions } from "./test-options";
import { useServerConnection } from "./use-server-connection";

export function MatchPlayOnline(props: Omit<StandardMatchPlayProps, "serverConnection">): JSX.Element {
    const serverConnection = useServerConnection({matchID: props.matchID, player: props.player});
    return <div>
        <TestOptions serverConnection={serverConnection} />
        <StandardMatchPlay {...props} serverConnection={serverConnection} />
    </div>;
}